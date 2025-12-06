from rest_framework import serializers
from .models import Quiz, Round, Team, QuestionBank, QuizQuestion

class QuestionBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionBank
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

class QuizQuestionSerializer(serializers.ModelSerializer):
    question_details = QuestionBankSerializer(source='question', read_only=True)
    
    class Meta:
        model = QuizQuestion
        fields = '__all__'

class RoundSerializer(serializers.ModelSerializer):
    questions = QuizQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Round
        fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
    rounds = RoundSerializer(many=True, read_only=True)
    teams = TeamSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = '__all__'
