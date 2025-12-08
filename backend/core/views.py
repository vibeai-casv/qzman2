from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from .models import Quiz, QuestionBank, Team, Round, QuizQuestion, ScoreLog
from .serializers import QuizSerializer, QuestionBankSerializer, TeamSerializer

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    print(f"DEBUG LOGIN Attempt: user='{username}' pass='{password}'")

    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        print(f"DEBUG LOGIN Success: {user} Active={user.is_active}")
        login(request, user)
        
        # Determine Role
        role = 'USER'
        if user.is_superuser:
            role = 'SUPER_ADMIN'
        elif user.groups.filter(name='Score Manager').exists():
            role = 'SCORE_MANAGER'
        elif user.groups.filter(name='Quiz Master').exists():
            role = 'QUIZ_MASTER'
        elif user.is_staff:
             role = 'ADMIN'

        return Response({
            'success': True,
            'role': role,
            'username': user.username
        })
    else:
        return Response({'success': False, 'error': 'Invalid Credentials'}, status=400)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'success': True})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    role = 'USER'
    if user.is_superuser:
        role = 'SUPER_ADMIN'
    elif user.groups.filter(name='Score Manager').exists():
         role = 'SCORE_MANAGER'
    elif user.groups.filter(name='Quiz Master').exists():
        role = 'QUIZ_MASTER'
    elif user.is_staff:
         role = 'ADMIN'
            
    return Response({
        'username': user.username,
        'role': role,
        'is_authenticated': True
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token(request):
    return Response({'csrfToken': get_token(request)})

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    @action(detail=True, methods=['get'])
    def export_data(self, request, pk=None):
        """Export Quiz and all related data to JSON"""
        quiz = self.get_object()
        serializer = self.get_serializer(quiz)
        data = serializer.data
        
        # We start by initializing the response content
        import json
        response = HttpResponse(
            json.dumps(data, indent=2),
            content_type='application/json'
        )
        response['Content-Disposition'] = f'attachment; filename="{quiz.title.replace(" ", "_").lower()}.json"'
        return response

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser, JSONParser])
    def import_quiz(self, request):
        """Import a quiz from a JSON file"""
        import json
        
        data = None
        if 'file' in request.data:
            file_obj = request.data['file']
            try:
                # Read file content and decode
                content = file_obj.read().decode('utf-8')
                data = json.loads(content)
            except Exception as e:
                 return Response({'error': f'Invalid JSON file: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        else:
             data = request.data

        if not data:
            return Response({'error': 'No data provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Start manual import process
        try:
             # 1. Create Quiz
             user = request.user if request.user.is_authenticated else User.objects.first()
             quiz_data = {
                 'title': data.get('title', 'Imported Quiz') + ' (Imported)',
                 'description': data.get('description', ''),
                 'created_by': user # Assign to current user (or first user)
             }
             quiz = Quiz.objects.create(**quiz_data)

             # 2. Process Rounds
             rounds_data = data.get('rounds', [])
             for rnd in rounds_data:
                 round_obj = Round.objects.create(
                     quiz=quiz,
                     name=rnd.get('name', 'Round'),
                     type=rnd.get('type', 'MCQ'),
                     order=rnd.get('order', 0),
                     settings=rnd.get('settings', {})
                 )

                 # 3. Process Questions
                 questions_data = rnd.get('questions', [])
                 for q_item in questions_data:
                     # Check if Question exists in Bank (by text) to avoid dups
                     q_details = q_item.get('question_details', {})
                     if not q_details: continue

                     q_text = q_details.get('text')
                     
                     # Simple dedup strategy: exact match on text
                     question_bank_obj, created = QuestionBank.objects.get_or_create(
                        text=q_text,
                        defaults={
                            'type': q_details.get('type', 'TEXT'),
                            'options': q_details.get('options', []),
                            'answer': q_details.get('answer', ''),
                            'category': q_details.get('category', 'General'),
                            'tags': q_details.get('tags', []),
                            'difficulty': q_details.get('difficulty', 'MEDIUM'),
                            'media_url': q_details.get('media_url')
                        }
                     )
                     
                     # Link to Round
                     QuizQuestion.objects.create(
                         round=round_obj,
                         question=question_bank_obj,
                         order=q_item.get('order', 0),
                         points=q_item.get('points', 10),
                         is_cloned=q_item.get('is_cloned', False)
                     )
             
             return Response(QuizSerializer(quiz).data, status=status.HTTP_201_CREATED)
             
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Allow a team to join via access code"""
        quiz = self.get_object()
        code = request.data.get('access_code')
        name = request.data.get('team_name')

        if not name:
            return Response({'error': 'Team Name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if code != quiz.code:
             return Response({'error': 'Invalid Access Code'}, status=status.HTTP_403_FORBIDDEN)

        # Check if team already exists/verify logic here
        # For now, minimal logic
        team, created = Team.objects.get_or_create(quiz=quiz, name=name)
        return Response(TeamSerializer(team).data)

from .ai import generate_questions_from_topic

class QuestionBankViewSet(viewsets.ModelViewSet):
    queryset = QuestionBank.objects.all()
    serializer_class = QuestionBankSerializer

    @action(detail=False, methods=['post'])
    def generate(self, request):
        topic = request.data.get('topic')
        count = int(request.data.get('count', 5))
        difficulty = request.data.get('difficulty', 'MEDIUM')

        if not topic:
            return Response({'error': 'Topic is required'}, status=status.HTTP_400_BAD_REQUEST)

        questions_data = generate_questions_from_topic(topic, count, difficulty)
        
        created_questions = []
        for q in questions_data:
            obj, created = QuestionBank.objects.get_or_create(
                text=q['text'],
                defaults={
                    'type': q.get('type', 'MCQ'),
                    'options': q.get('options', []),
                    'answer': q.get('answer', ''),
                    'category': q.get('category', topic),
                    'difficulty': q.get('difficulty', difficulty)
                }
            )
            created_questions.append(obj)

        return Response(QuestionBankSerializer(created_questions, many=True).data)

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
