@echo off
echo Starting PC-CONN File Sharing App...
echo.

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Installing server dependencies...
cd server
call npm install
if errorlevel 1 (
    echo Failed to install server dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Starting server...
start "PC-CONN Server" cmd /k "cd server && npm start"

echo.
echo Waiting for server to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting React app...
start "PC-CONN App" cmd /k "npm start"

echo.
echo PC-CONN is starting up!
echo - Server will run on http://localhost:3001
echo - React app will run on http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul
