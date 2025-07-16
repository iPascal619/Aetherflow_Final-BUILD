@echo off
title AetherFlow Setup Assistant
color 0A
echo.
echo  █████╗ ███████╗████████╗██╗  ██╗███████╗██████╗ ███████╗██╗      ██████╗ ██╗    ██╗
echo ██╔══██╗██╔════╝╚══██╔══╝██║  ██║██╔════╝██╔══██╗██╔════╝██║     ██╔═══██╗██║    ██║
echo ███████║█████╗     ██║   ███████║█████╗  ██████╔╝█████╗  ██║     ██║   ██║██║ █╗ ██║
echo ██╔══██║██╔══╝     ██║   ██╔══██║██╔══╝  ██╔══██╗██╔══╝  ██║     ██║   ██║██║███╗██║
echo ██║  ██║███████╗   ██║   ██║  ██║███████╗██║  ██║██║     ███████╗╚██████╔╝╚███╔███╔╝
echo ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
echo.
echo                           Setup Assistant for Desktop App
echo.
echo ================================================================================
echo.

echo Step 1: Checking Python installation...
echo.

REM Check for Python
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] Python found and ready!
    python --version
    goto :install_deps
)

python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] Python3 found and ready!
    python3 --version
    goto :install_deps
)

py --version >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] Python Launcher found and ready!
    py --version
    goto :install_deps
)

echo [✗] Python not found!
echo.
echo AetherFlow requires Python 3.8+ to run the AI backend.
echo.
echo EASY FIX OPTIONS:
echo.
echo Option 1 (Recommended): Install from Microsoft Store
echo   - Search "Python" in Microsoft Store
echo   - Install Python 3.11 or higher
echo   - Automatic PATH setup
echo.
echo Option 2: Install from python.org
echo   - Go to https://python.org/downloads
echo   - Download Python 3.8 or higher
echo   - IMPORTANT: Check "Add Python to PATH" during install
echo.
echo After installing Python, run this script again.
echo.
set /p choice="Open Python download page? (y/n): "
if /i "%choice%"=="y" (
    start https://python.org/downloads
)
pause
exit /b 1

:install_deps
echo.
echo Step 2: Installing AI dependencies...
echo.

REM Try to install with different Python commands
python -m pip install -r model\requirements.txt >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] Dependencies installed successfully!
    goto :success
)

python3 -m pip install -r model\requirements.txt >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] Dependencies installed successfully!
    goto :success
)

py -m pip install -r model\requirements.txt >nul 2>&1
if %errorlevel% == 0 (
    echo [✓] Dependencies installed successfully!
    goto :success
)

echo [✗] Failed to install dependencies
echo.
echo This might be due to:
echo 1. Internet connection issues
echo 2. Permission problems
echo 3. Python pip not working
echo.
echo Try running this as Administrator or check your internet connection.
pause
exit /b 1

:success
echo.
echo ================================================================================
echo.
echo [🎉] SUCCESS! AetherFlow is ready to run!
echo.
echo Next steps:
echo 1. Close this window
echo 2. Double-click the AetherFlow desktop icon
echo 3. The app will start with a splash screen
echo 4. Enjoy using AetherFlow!
echo.
echo ================================================================================
echo.
pause
