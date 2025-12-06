from django.db import models
from django.contrib.auth.models import User

class QuestionBank(models.Model):
    QUESTION_TYPES = [
        ('MCQ', 'Multiple Choice'),
        ('TEXT', 'Direct Answer'),
        ('MEDIA', 'Multimedia'),
    ]
    DIFFICULTY = [
        ('EASY', 'Easy'),
        ('MEDIUM', 'Medium'),
        ('HARD', 'Hard'),
    ]

    text = models.TextField()
    media_url = models.URLField(blank=True, null=True)
    type = models.CharField(max_length=10, choices=QUESTION_TYPES, default='TEXT')
    options = models.JSONField(default=list, blank=True)  # List of strings for MCQs
    answer = models.TextField()  # Correct Answer
    category = models.CharField(max_length=100, db_index=True)
    tags = models.JSONField(default=list, blank=True)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY, default='MEDIUM')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category}: {self.text[:50]}..."

class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    code = models.CharField(max_length=10, default='ABCD', help_text="Code players use to join")
    scheduled_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.title

class Team(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='teams')
    name = models.CharField(max_length=100)
    members = models.TextField(blank=True)  # Comma separated names
    score = models.IntegerField(default=0)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Round(models.Model):
    ROUND_TYPES = [
        ('MCQ', 'Preliminary MCQ'),
        ('BUZZER', 'Buzzer Round'),
        ('PASS', 'Pass/Bounce'),
        ('RAPID', 'Rapid Fire'),
    ]

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='rounds')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=ROUND_TYPES)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=False)
    settings = models.JSONField(default=dict) # E.g., timer duration, negative marks

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.quiz.title} - {self.name}"

class QuizQuestion(models.Model):
    """Link a generic Question to a specific Round in a Quiz"""
    round = models.ForeignKey(Round, on_delete=models.CASCADE, related_name='questions')
    question = models.ForeignKey(QuestionBank, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    points = models.IntegerField(default=10)
    is_cloned = models.BooleanField(default=False) # If true, this is a distinct instance/clone of the original question

    class Meta:
        ordering = ['order']

class ScoreLog(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='score_logs')
    round = models.ForeignKey(Round, on_delete=models.SET_NULL, null=True)
    question = models.ForeignKey(QuizQuestion, on_delete=models.SET_NULL, null=True)
    points = models.IntegerField()
    reason = models.CharField(max_length=255) # Mandatory reason for manual changes
    timestamp = models.DateTimeField(auto_now_add=True)
    awarded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
