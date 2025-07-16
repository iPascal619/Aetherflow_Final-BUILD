@echo off
echo Installing AetherFlow Portable...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo Python found. Installing dependencies...
python -m pip install --user -r requirements.txt

if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Installation complete!
echo Run 'start-aetherflow.bat' to launch the application.
pause
