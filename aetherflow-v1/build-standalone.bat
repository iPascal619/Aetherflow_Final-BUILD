@echo off
echo ====================================
echo    AetherFlow Build Script
echo ====================================
echo.

echo 🔧 Building standalone AetherFlow application...
echo.

echo Step 1: Installing Python dependencies...
cd model
if not exist ".venv" (
    echo Creating Python virtual environment...
    python -m venv .venv
)

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo Installing requirements...
pip install -r requirements.txt
pip install pyinstaller

echo.
echo Step 2: Building AI server executable...
cd ..
python build-ai-server.py

if errorlevel 1 (
    echo ❌ Failed to build AI server!
    pause
    exit /b 1
)

echo.
echo Step 3: Installing Node.js dependencies...
npm install

if errorlevel 1 (
    echo ❌ Failed to install Node.js dependencies!
    pause
    exit /b 1
)

echo.
echo Step 4: Building Electron application...
npm run build-win

if errorlevel 1 (
    echo ❌ Failed to build Electron app!
    pause
    exit /b 1
)

echo.
echo ✅ Build completed successfully!
echo 📦 Your installer is in the 'dist' folder
echo.
pause
