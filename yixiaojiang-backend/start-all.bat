@echo off
chcp 65001 >nul
title Xiaohuangjiang Platform - Service Starter
echo ========================================
echo    Xiaohuangjiang Platform - Start All
echo ========================================
echo.

echo [1/3] Starting AI Service (Port 8000)...
start "AI Service" cmd /k "cd /d E:\luoping-ginger-v1\backend && call venv\Scripts\activate.bat && python main.py"
timeout /t 5 /nobreak >nul

echo.
echo [2/3] Starting Spring Boot Backend (Port 8080)...
start "Backend Service" cmd /k "cd /d E:\Springboot-xiaohuangjiang\yixiaojiang-backend && mvnw.cmd spring-boot:run"
timeout /t 15 /nobreak >nul

echo.
echo [3/3] Starting Frontend (Port 5173)...
start "Frontend" cmd /k "cd /d E:\Springboot-xiaohuangjiang\yixiaojiang-backend\ginger-frontend && npm run dev"

echo.
echo ========================================
echo    All services started!
echo ========================================
echo.
echo URLs:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8088
echo   AI:       http://localhost:8000
echo.
pause