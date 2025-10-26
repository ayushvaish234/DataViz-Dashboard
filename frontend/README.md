# dataviz-dashboard

Full-stack Data Visualization Dashboard (FastAPI backend + React frontend).

## Setup

### Backend
1. `cd backend`
2. `python -m venv venv`
3. activate venv:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. `pip install -r requirements.txt`
5. `uvicorn main:app --reload`
6. Open `http://127.0.0.1:8000/docs` to view API.

### Frontend
1. `cd frontend`
2. `npm install` (if dependency conflicts, try `--legacy-peer-deps`)
3. Ensure Tailwind is set up: `npx tailwindcss init -p` (or `.\node_modules\.bin\tailwindcss.exe init -p` on Windows)
4. `npm run dev`
5. Open `http://localhost:5173`

### EmailJS
- Create EmailJS account, copy Service ID, Template ID, Public Key into `frontend/src/services/emailService.js`.

## Notes
- Change JWT secret via env var `JWT_SECRET` in production.
- For large files / production, use object storage and background processing.
