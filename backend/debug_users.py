import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qzman.settings')
django.setup()

User = get_user_model()

users = ['sadmin', 'admin', 'qzmaster', 'scoremanager']
password = 'password@123'

print("Checking users...")
for username in users:
    try:
        user = User.objects.get(username=username)
        print(f"User found: {username}")
        user.set_password(password)
        user.save()
        print(f"Password reset for: {username}")
        
        if user.check_password(password):
             print(f"  > Verification: Password matches.")
        else:
             print(f"  > Verification: FAILED.")

    except User.DoesNotExist:
        print(f"ERROR: User {username} does not exist!")

print("Done.")
