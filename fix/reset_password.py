import os
import sys
import django

# Add backend directory to path so we can import settings
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qzman.settings')
django.setup()

from django.contrib.auth import get_user_model

def get_users():
    return get_user_model().objects.all().order_by('username')

def reset_password():
    users = get_users()
    
    print("\n--- Available Users ---")
    for i, user in enumerate(users, 1):
        role = "User"
        if user.is_superuser: role = "Super Admin"
        elif user.is_staff: role = "Admin"
        
        # Check groups
        if user.groups.filter(name='Quiz Master').exists(): role = "Quiz Master"
        if user.groups.filter(name='Score Manager').exists(): role = "Score Manager"
        
        print(f"{i}. {user.username} ({role})")
    print("-----------------------")

    selection = input("\nEnter the username to reset password for (or 'q' to quit): ").strip()
    
    if selection.lower() == 'q':
        return

    try:
        user = get_user_model().objects.get(username=selection)
        
        confirm = input(f"Reset password for '{user.username}' to 'password@123'? (y/n): ")
        if confirm.lower() == 'y':
            user.set_password('password@123')
            user.save()
            print(f"\nSUCCESS: Password for '{user.username}' has been reset to 'password@123'.")
        else:
            print("\nOperation cancelled.")
            
    except get_user_model().DoesNotExist:
        print(f"\nERROR: User '{selection}' not found.")

if __name__ == "__main__":
    reset_password()
