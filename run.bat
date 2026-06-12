@echo off
echo ====================================================================
echo                 UniSphere - Starting Client and Server
echo ====================================================================
echo.
echo Starting Backend (Node.js)...
start "UniSphere Backend (Node.js)" cmd /c "cd backend && npm run dev"
echo.
echo Starting Frontend (Vite Client)...
start "UniSphere Frontend (Vite React)" cmd /c "cd frontend && cmd /c npm run dev"
echo.
echo ====================================================================
echo Both servers have been launched in separate windows!
echo.
echo - Frontend Development Server: http://localhost:5173
echo - Backend API Server:          http://localhost:8080
echo - Backend H2 Console:          http://localhost:8080/api-docs
echo.
echo You can close the spawned windows when you want to stop the servers.
echo ====================================================================
echo.
pause

