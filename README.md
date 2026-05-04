# Blockchain-Based Document Verification Web Application

Software engineering course project for secure business document verification.

## Project Structure

```text
document-verification-project/
├── backend/
└── frontend/
```

## Backend

The backend is built with Django REST Framework.

Main features:

- user registration and login
- buyer, supplier, and both roles
- factory profiles
- document upload
- SHA-256 hashing
- simulated blockchain record
- document verification
- rule-based risk level
- trust score and badge
- disputes and supplier responses

Run backend:

```powershell
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Backend URL:

```text
http://127.0.0.1:8000
```

## Frontend

The frontend team will add the React project inside the `frontend/` folder.

Protected backend APIs need this header after login:

```http
Authorization: Token YOUR_TOKEN
```
