from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.middleware.csrf import get_token

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(request, username=username, password=password)
    if user is not None:
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
