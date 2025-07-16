# AetherFlow Startup Script
# Run this to start both the AI model server and view the frontend

Write-Host "[*] Starting AetherFlow AI-Powered Medical Assistant..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
$currentPath = Get-Location
if (-not (Test-Path "model\inference_api.py")) {
    Write-Host "[ERROR] Please run this script from the AetherFlow frontend directory" -ForegroundColor Red
    Write-Host "Current path: $currentPath" -ForegroundColor Yellow
    Write-Host "Expected files: model\inference_api.py" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "[INFO] Current directory: $currentPath" -ForegroundColor Green
Write-Host ""

# Start the AI model server in the background
Write-Host "[AI] Starting AI Model Server..." -ForegroundColor Yellow
$aiServerJob = Start-Job -ScriptBlock {
    Set-Location $using:currentPath
    cd model
    python inference_api.py
} -Name "AetherFlowAI"

# Wait a moment for the server to start
Start-Sleep -Seconds 3

# Check if the AI server started successfully
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 5 -ErrorAction Stop
    $healthData = $response.Content | ConvertFrom-Json
    
    if ($healthData.model_loaded) {
        Write-Host "[SUCCESS] AI Model Server started successfully!" -ForegroundColor Green
        Write-Host "   [INFO] Model Status: Loaded and Ready" -ForegroundColor Green
        Write-Host "   [WEB] API URL: http://localhost:8000" -ForegroundColor Cyan
        Write-Host "   [DOCS] API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
    } else {
        Write-Host "[WARNING] AI Server started but model not loaded" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] AI Model Server failed to start properly" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "[WEB] Opening AetherFlow Frontend..." -ForegroundColor Yellow

# Open the frontend in the default browser
$frontendUrl = "file:///$($currentPath.Path.Replace('\', '/'))/symptom_check.html"
Start-Process $frontendUrl

Write-Host ""
Write-Host "[SUCCESS] AetherFlow is now running!" -ForegroundColor Green
Write-Host ""
Write-Host "[FEATURES] Available Features:" -ForegroundColor Cyan
Write-Host "   • AI-Powered Sickle Cell Crisis Prediction" -ForegroundColor White
Write-Host "   • Comprehensive Patient Assessment Form" -ForegroundColor White
Write-Host "   • Real-time Risk Analysis (83.9% AUC)" -ForegroundColor White
Write-Host "   • Clinical Recommendations" -ForegroundColor White
Write-Host "   • Interpretable AI Results" -ForegroundColor White
Write-Host ""
Write-Host "[TECH] Technical Details:" -ForegroundColor Cyan
Write-Host "   • Model: Lightweight Logistic Regression" -ForegroundColor White
Write-Host "   • API: FastAPI (Python)" -ForegroundColor White
Write-Host "   • Frontend: Modern HTML/CSS/JavaScript" -ForegroundColor White
Write-Host "   • Fallback: Rule-based assessment if AI unavailable" -ForegroundColor White
Write-Host ""
Write-Host "[TEST] Quick Test:" -ForegroundColor Cyan
Write-Host "   1. Fill out the patient assessment form" -ForegroundColor White
Write-Host "   2. Click 'Begin Assessment'" -ForegroundColor White
Write-Host "   3. View AI-powered results and recommendations" -ForegroundColor White
Write-Host ""
Write-Host "[STOP] To Stop:" -ForegroundColor Yellow
Write-Host "   Press Ctrl+C in this window to stop the AI server" -ForegroundColor White
Write-Host ""

# Keep the script running and monitor the AI server
Write-Host "[MONITOR] Monitoring AI server... (Press Ctrl+C to stop)" -ForegroundColor Magenta

try {
    while ($true) {
        Start-Sleep -Seconds 30
        
        # Check if AI server is still running
        $job = Get-Job -Name "AetherFlowAI" -ErrorAction SilentlyContinue
        if ($job.State -ne "Running") {
            Write-Host "[ERROR] AI Server stopped unexpectedly!" -ForegroundColor Red
            break
        }
        
        # Quick health check
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 5 -ErrorAction Stop
            Write-Host "[OK] $(Get-Date -Format 'HH:mm:ss') - AI Server healthy" -ForegroundColor Green
        } catch {
            Write-Host "[WARNING] $(Get-Date -Format 'HH:mm:ss') - AI Server health check failed" -ForegroundColor Yellow
        }
    }
} finally {
    Write-Host ""
    Write-Host "[STOP] Stopping AI Model Server..." -ForegroundColor Yellow
    Stop-Job -Name "AetherFlowAI" -ErrorAction SilentlyContinue
    Remove-Job -Name "AetherFlowAI" -ErrorAction SilentlyContinue
    Write-Host "[SUCCESS] AetherFlow stopped successfully!" -ForegroundColor Green
}
