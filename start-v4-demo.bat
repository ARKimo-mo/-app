@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Career Copy AI V4 Demo

echo ========================================
echo   Career Copy AI V4 - Local Demo Server
echo ========================================
echo.
echo Demo URL: http://localhost:3012/v4
echo.
echo Keep this window open during the demo.
echo Press Ctrl+C to stop the server.
echo.

if not exist ".next" (
  echo Production build not found. Building now...
  call npm.cmd run build
  if errorlevel 1 (
    echo.
    echo Build failed. Please check the error above.
    pause
    exit /b 1
  )
)

call npm.cmd run start -- --hostname 0.0.0.0 --port 3012
pause
