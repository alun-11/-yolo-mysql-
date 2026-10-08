@echo off
chcp 65001 >nul
echo ========================================
echo    AI Disease Detection Service
echo ========================================
echo.

cd /d "E:\luoping-ginger-v1\backend"
call venv\Scripts\activate.bat
set MODEL_PATH=E:\Springboot-xiaohuangjiang\yixiaojiang-backend\ai_models\best.pt
python main.py

pause