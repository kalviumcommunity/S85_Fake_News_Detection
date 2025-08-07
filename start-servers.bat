@echo off
echo Starting FakeSpotter Backend...
cd /d "e:\project\Fake News Detection\backend"
start "Backend Server" cmd /k "node server.js"

echo Starting FakeSpotter Frontend...
cd /d "e:\project\Fake News Detection\client"
start "Frontend Server" cmd /k "npm run dev"

echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
pause
