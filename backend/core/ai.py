import os
import json
from openai import OpenAI
from django.conf import settings

def generate_questions_from_topic(topic, count=5, difficulty='MEDIUM'):
    """
    Generates questions using OpenAI API.
    Returns a list of dicts: {text, type, options, answer, category, difficulty}
    """
    api_key = getattr(settings, 'OPENAI_API_KEY', os.getenv('OPENAI_API_KEY'))
    
    if not api_key:
        # Fallback Mock for Demo if no key
        return [
            {
                "text": f"Mock Generated Question about {topic} #{i+1}",
                "type": "MCQ",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answer": "Option A",
                "category": topic,
                "difficulty": difficulty
            } for i in range(count)
        ]

    client = OpenAI(api_key=api_key)

    prompt = f"""
    Generate {count} {difficulty} level quiz questions about "{topic}".
    Format the output strictly as a JSON array of objects with these keys:
    - text: string (the question)
    - type: "MCQ" or "TEXT"
    - options: array of strings (4 options for MCQ, empty for TEXT)
    - answer: string (the correct answer text)
    - category: string (use "{topic}")
    - difficulty: "{difficulty}"

    Provide ONLY the JSON array.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a quiz generation assistant that outputs raw JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        # Basic cleanup if markdown fences are included
        if "```json" in content:
            content = content.replace("```json", "").replace("```", "")
        
        return json.loads(content)

    except Exception as e:
        print(f"AI Generation Error: {e}")
        return []
