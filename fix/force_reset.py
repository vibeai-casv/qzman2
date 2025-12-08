import os
import sys
import django

sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qzman.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Users to update
users_to_update = ['sadmin', 'admin', 'qzmaster', 'scoremanager']
new_password = 'qzman@2025'

print(f"Resetting passwords to: {new_password}")

for username in users_to_update:
    try:
        user = User.objects.get(username=username)
        user.set_password(new_password)
        user.is_active = True # Ensure they are active
        user.save()
        print(f"SUCCESS: Reset password for {username}")
    except User.DoesNotExist:
        print(f"WARNING: User {username} not found")

print("Done.")
