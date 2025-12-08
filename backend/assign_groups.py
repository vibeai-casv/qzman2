import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qzman.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()

# Create Groups
qm_group, _ = Group.objects.get_or_create(name='Quiz Master')
sm_group, _ = Group.objects.get_or_create(name='Score Manager')

# User Roles Mapping
user_roles = {
    'qzmaster': qm_group,
    'scoremanager': sm_group
}

for username, group in user_roles.items():
    try:
        user = User.objects.get(username=username)
        user.groups.add(group)
        print(f"Added {username} to {group.name}")
    except User.DoesNotExist:
        print(f"User {username} not found")
