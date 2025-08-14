@echo off
echo Starting Budget AI Application...
echo.

echo Starting Backend Server (FastAPI)...
start "Backend Server" cmd /k "cd server && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server (React)...
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo Budget AI is starting up!
echo.
echo Backend API: http://localhost:8000
echo Frontend App: http://localhost:5173
echo API Documentation: http://localhost:8000/docs
echo.
echo Press any key to close this window...
pause > nul
