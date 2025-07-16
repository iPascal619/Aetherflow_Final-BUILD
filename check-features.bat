@echo off
echo ========================================
echo AetherFlow Blockchain Features Check
echo ========================================
echo.

echo Checking required files for blockchain integration...
echo.

REM Check blockchain core files
if exist "js\blockchain-integrity.js" (
    echo ✓ Blockchain integrity module: FOUND
) else (
    echo ✗ Blockchain integrity module: MISSING
)

if exist "blockchain-settings.html" (
    echo ✓ Blockchain settings page: FOUND
) else (
    echo ✗ Blockchain settings page: MISSING
)

if exist "test-blockchain-integration.html" (
    echo ✓ Blockchain test page: FOUND
) else (
    echo ✗ Blockchain test page: MISSING
)

REM Check documentation
if exist "BLOCKCHAIN-INTEGRATION-PROPOSAL.md" (
    echo ✓ Integration proposal: FOUND
) else (
    echo ✗ Integration proposal: MISSING
)

if exist "BLOCKCHAIN-IMPLEMENTATION-GUIDE.md" (
    echo ✓ Implementation guide: FOUND
) else (
    echo ✗ Implementation guide: MISSING
)

REM Check core app files
if exist "js\storage-adapter.js" (
    echo ✓ Storage adapter: FOUND
) else (
    echo ✗ Storage adapter: MISSING
)

if exist "electron-main.js" (
    echo ✓ Electron main process: FOUND
) else (
    echo ✗ Electron main process: MISSING
)

if exist "preload.js" (
    echo ✓ Preload script: FOUND
) else (
    echo ✗ Preload script: MISSING
)

echo.
echo Checking blockchain integration in HTML files...

REM Check if blockchain navigation is added
findstr /m "blockchain-settings.html" *.html >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Blockchain navigation: FOUND in HTML files
) else (
    echo ✗ Blockchain navigation: NOT FOUND in HTML files
)

REM Check if blockchain scripts are included
findstr /m "blockchain-integrity.js" *.html >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Blockchain scripts: INCLUDED in HTML files
) else (
    echo ✗ Blockchain scripts: NOT INCLUDED in HTML files
)

echo.
echo Checking AI integration...

if exist "api\server.js" (
    echo ✓ AI API server: FOUND
) else (
    echo ✗ AI API server: MISSING
)

if exist "model\train_model.py" (
    echo ✓ AI model training: FOUND
) else (
    echo ✗ AI model training: MISSING
)

echo.
echo ========================================
echo Feature Check Complete
echo ========================================
echo.
echo If any items show as MISSING, the build may not
echo include all blockchain and AI features.
echo.
echo To fix missing items:
echo 1. Re-run the blockchain integration setup
echo 2. Ensure all files are in the correct locations
echo 3. Check that navigation links are properly added
echo.
pause
