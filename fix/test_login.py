import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api/auth/login/"
USERNAME = "sadmin"
PASSWORD = "qzman@2025"

def test_login():
    print(f"Testing Login for user: {USERNAME}")
    payload = {
        "username": USERNAME,
        "password": PASSWORD
    }
    
    try:
        # Create a session to handle cookies if needed (though API is usually stateless token or session-id)
        session = requests.Session()
        
        # 1. Login Request
        print(f"Sending POST to {BASE_URL} with payload: {payload}")
        response = session.post(BASE_URL, json=payload, headers={"Content-Type": "application/json"})
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {response.headers}")
        
        try:
            data = response.json()
            print("Response JSON:")
            print(json.dumps(data, indent=2))
            
            if data.get("success"):
                print("\n[SUCCESS] Login Verified!")
            else:
                print(f"\n[FAILED] Error: {data.get('error')}")
                
        except json.JSONDecodeError:
            print(f"[FAILED] Could not decode JSON. Raw Text: {response.text}")

    except Exception as e:
        print(f"[ERROR] Exception occurred: {e}")

if __name__ == "__main__":
    test_login()
