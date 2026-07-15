# AI Digital Passport

AI + Blockchain product authenticity verification system prototype.

## Setup & Running Locally

This project consists of a React frontend and a FastAPI backend.

### 1. Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   - Windows: `.\venv\Scripts\Activate`
   - Mac/Linux: `source venv/bin/activate`
3. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be running at `http://localhost:8000`. 
   You can verify it by visiting `http://localhost:8000/health`.

### 2. Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173`.
