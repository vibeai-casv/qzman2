from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'quizzes', views.QuizViewSet)
router.register(r'questions', views.QuestionBankViewSet)
router.register(r'teams', views.TeamViewSet)

urlpatterns = [
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/me/', views.me_view, name='me'),
    path('auth/csrf/', views.csrf_token, name='csrf'),
    path('', include(router.urls)),
]
