@echo off
echo ==============================================
echo AetherFlow Startup Status Check
echo ==============================================
echo.

echo Checking if AetherFlow processes are running...
tasklist /FI "IMAGENAME eq AetherFlow.exe" /FO TABLE 2>nul | find /I "AetherFlow.exe" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ AetherFlow main process: RUNNING
) else (
    echo ❌ AetherFlow main process: NOT RUNNING
)

tasklist /FI "IMAGENAME eq node.exe" /FO TABLE 2>nul | find /I "node.exe" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Node.js processes: DETECTED
) else (
    echo ⚠️ Node.js processes: NOT DETECTED
)

tasklist /FI "IMAGENAME eq python.exe" /FO TABLE 2>nul | find /I "python.exe" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Python processes: DETECTED
) else (
    echo ⚠️ Python processes: NOT DETECTED
)

echo.
echo Checking network services...
netstat -an | find ":3001" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ API Server (port 3001): LISTENING
) else (
    echo ❌ API Server (port 3001): NOT LISTENING
)

netstat -an | find ":8000" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ AI Server (port 8000): LISTENING
) else (
    echo ❌ AI Server (port 8000): NOT LISTENING
)

echo.
echo Checking file structure...
if exist "package.json" (
    echo ✅ package.json: EXISTS
) else (
    echo ❌ package.json: MISSING
)

if exist "electron-main.js" (
    echo ✅ electron-main.js: EXISTS
) else (
    echo ❌ electron-main.js: MISSING
)

if exist "model\sickle_cell_crisis_model.pkl" (
    echo ✅ AI Model: TRAINED AND READY
) else (
    echo ⚠️ AI Model: NOT TRAINED
)

if exist "js\blockchain-integrity.js" (
    echo ✅ Blockchain module: EXISTS
) else (
    echo ❌ Blockchain module: MISSING
)

echo.
echo ==============================================
echo Status check complete!
echo ==============================================
pause
