@echo off
echo ========================================
echo AetherFlow Electron Prototype Builder
echo ========================================
echo.

echo [1/8] Checking Node.js and npm...
call node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

call npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

echo.
echo [2/8] Installing Electron dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/8] Installing API dependencies...
cd api
if exist package.json (
    call npm install
    if %errorlevel% neq 0 (
        echo WARNING: Failed to install API dependencies, AI features may not work
    )
) else (
    echo WARNING: API package.json not found, AI features may not work
)
cd ..

echo.
echo [4/8] Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo WARNING: Python not found, AI model features may not work
    echo You can install Python from https://python.org
) else (
    echo Python found, checking AI model dependencies...
    cd model
    if exist requirements.txt (
        pip install -r requirements.txt
        if %errorlevel% neq 0 (
            echo WARNING: Failed to install Python dependencies
        )
    )
    cd ..
)

echo.
echo [5/8] Verifying blockchain integration files...
if exist "js\blockchain-integrity.js" (
    echo ✓ Blockchain integrity module found
) else (
    echo WARNING: Blockchain module missing
)

if exist "blockchain-settings.html" (
    echo ✓ Blockchain settings page found
) else (
    echo WARNING: Blockchain settings page missing
)

echo.
echo [6/8] Creating development build directory...
if not exist "dist" mkdir dist
if not exist "dist\prototype" mkdir dist\prototype

echo.
echo [7/8] Building Electron prototype (unpacked)...
call npx electron-builder --dir --config.directories.output=dist/prototype
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [8/8] Creating launch scripts...

REM Create Windows launcher
echo @echo off > "dist\prototype\AetherFlow-Prototype.bat"
echo echo Starting AetherFlow Prototype... >> "dist\prototype\AetherFlow-Prototype.bat"
echo cd "win-unpacked" >> "dist\prototype\AetherFlow-Prototype.bat"
echo start "AetherFlow" "AetherFlow.exe" >> "dist\prototype\AetherFlow-Prototype.bat"

REM Create feature summary
echo AetherFlow Prototype Build - Feature Summary > "dist\prototype\FEATURES.txt"
echo ============================================== >> "dist\prototype\FEATURES.txt"
echo. >> "dist\prototype\FEATURES.txt"
echo Core Features: >> "dist\prototype\FEATURES.txt"
echo - Sickle Cell Crisis Risk Assessment >> "dist\prototype\FEATURES.txt"
echo - Patient Management System >> "dist\prototype\FEATURES.txt"
echo - Healthcare Provider Dashboard >> "dist\prototype\FEATURES.txt"
echo - Offline-First Data Storage >> "dist\prototype\FEATURES.txt"
echo. >> "dist\prototype\FEATURES.txt"
echo NEW Features in this Prototype: >> "dist\prototype\FEATURES.txt"
echo - Blockchain Data Integrity Verification >> "dist\prototype\FEATURES.txt"
echo - Cryptographic Audit Trails >> "dist\prototype\FEATURES.txt"
echo - Enhanced AI Model Integration >> "dist\prototype\FEATURES.txt"
echo - AI Health Companion API >> "dist\prototype\FEATURES.txt"
echo - Tamper Detection System >> "dist\prototype\FEATURES.txt"
echo - Multi-facility Data Sharing Support >> "dist\prototype\FEATURES.txt"
echo. >> "dist\prototype\FEATURES.txt"
echo Test Pages: >> "dist\prototype\FEATURES.txt"
echo - blockchain-settings.html (Blockchain Management) >> "dist\prototype\FEATURES.txt"
echo - test-blockchain-integration.html (Integration Tests) >> "dist\prototype\FEATURES.txt"
echo. >> "dist\prototype\FEATURES.txt"
echo Data Storage: >> "dist\prototype\FEATURES.txt"
echo - Primary: Electron Store (Persistent) >> "dist\prototype\FEATURES.txt"
echo - Backup: Local JSON files >> "dist\prototype\FEATURES.txt"
echo - Integrity: SHA-256 hash verification >> "dist\prototype\FEATURES.txt"
echo. >> "dist\prototype\FEATURES.txt"
echo Build Date: %date% %time% >> "dist\prototype\FEATURES.txt"

echo.
echo ========================================
echo ✓ AetherFlow Prototype Build Complete!
echo ========================================
echo.
echo Build Location: dist\prototype\
echo.
echo To test the prototype:
echo 1. Navigate to: dist\prototype\
echo 2. Run: AetherFlow-Prototype.bat
echo 3. Or directly run: win-unpacked\AetherFlow.exe
echo.
echo NEW FEATURES TO TEST:
echo - Blockchain settings in the healthcare nav menu
echo - Data integrity verification
echo - AI model training and prediction
echo - Test page: test-blockchain-integration.html
echo.
echo The AI model will auto-train on first run if needed.
echo All data is stored locally with blockchain integrity.
echo.
pause
