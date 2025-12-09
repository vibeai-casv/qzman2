import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qzman.settings')
django.setup()

from core.models import Quiz, Round

def create_round():
    try:
        quiz = Quiz.objects.first()
        if not quiz:
            print("No quiz found!")
            return

        print(f"Adding round to quiz: {quiz.title}")
        
        round = Round.objects.create(
            quiz=quiz,
            name="Round 1 (Scripted)",
            order=1,
            type="MCQ"
        )
        print(f"Successfully created round: {round.name} (ID: {round.id})")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_round()
