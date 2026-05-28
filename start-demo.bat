@echo off
cd /d "%~dp0"
echo Starting 职前副本 AI demo...
echo.
echo Building latest files...
npm.cmd run build
echo.
echo Open this URL after the server is ready:
echo http://localhost:5174
echo.
node serve-demo.mjs
pause
