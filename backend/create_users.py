import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qzman.settings')
django.setup()

User = get_user_model()

users = [
    {'username': 'sadmin', 'password': 'password@123', 'is_superuser': True, 'is_staff': True},
    {'username': 'admin', 'password': 'password@123', 'is_superuser': False, 'is_staff': True},
    {'username': 'qzmaster', 'password': 'password@123', 'is_superuser': False, 'is_staff': False},
    {'username': 'scoremanager', 'password': 'password@123', 'is_superuser': False, 'is_staff': False},
]

for u in users:
    try:
        if User.objects.filter(username=u['username']).exists():
            user = User.objects.get(username=u['username'])
            user.set_password(u['password'])
            user.is_superuser = u['is_superuser']
            user.is_staff = u['is_staff']
            user.save()
            print(f"Updated user: {u['username']}")
        else:
            User.objects.create_user(
                username=u['username'],
                password=u['password'],
                is_staff=u['is_staff'],
                is_superuser=u['is_superuser']
            )
            print(f"Created user: {u['username']}")
    except Exception as e:
        print(f"Error creating {u['username']}: {e}")
