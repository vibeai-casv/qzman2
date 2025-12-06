from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'quizzes', views.QuizViewSet)
router.register(r'questions', views.QuestionBankViewSet)
router.register(r'teams', views.TeamViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
