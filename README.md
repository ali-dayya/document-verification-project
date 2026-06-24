# Blockchain-Based Document Verification Web Application

Software engineering course project for secure business document verification.

## Team members
-Ali Dayya
-Cynthia Issa
-Assil Sabbagh
-Adnan Zeidan

## Project Structure

```text
document-verification-project/
|-- backend/
`-- frontend/
```

## Backend

The backend is built with Django REST Framework.

Main features:

- user registration and login
- buyer, supplier, and both roles
- factory profiles
- document upload
- SHA-256 hashing
- simulated or real blockchain record
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

The frontend is a React web application built with Vite.

Run frontend:

```powershell
cd frontend
npm install
npm run dev -- --host 127.0.0.1
```

Protected backend APIs need this header after login:

```http
Authorization: Token YOUR_TOKEN
```

## Deployment Notes

Recommended course deployment:

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL or any PostgreSQL database URL

Backend service settings on Render:

```text
Root Directory: backend
Build Command: bash build.sh
Start Command: gunicorn document_verification.wsgi:application
```

Backend environment variables:

```text
DJANGO_DEBUG=0
DJANGO_SECRET_KEY=generate a long secret value
DJANGO_ALLOWED_HOSTS=your-render-backend-url.onrender.com
DATABASE_URL=your-postgresql-connection-string
CORS_ALLOWED_ORIGINS=https://your-vercel-frontend-url.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-render-backend-url.onrender.com,https://your-vercel-frontend-url.vercel.app
BLOCKCHAIN_MODE=simulated
```

Frontend environment variable on Vercel:

```text
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```
