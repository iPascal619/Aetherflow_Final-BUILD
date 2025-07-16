const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class AIServerManager {
    constructor() {
        this.aiProcess = null;
        this.serverReady = false;
    }

    async startAIServer() {
        return new Promise((resolve, reject) => {
            // For reliability, always use Python script (executable was causing build issues)
            console.log('🐍 Starting AI server with Python script...');
            this.startPythonScript(resolve, reject);
        });
    }

    startWithFallback(resolve, reject) {
        console.log('Attempting to start AI server with executable...');
        
        // First try the executable
        this.startExecutable(
            () => {
                console.log('✅ AI Server started with executable');
                resolve();
            },
            (executableError) => {
                console.log('⚠️ Executable failed, trying Python fallback...');
                console.log('Executable error:', executableError.message);
                
                // Fallback to Python script
                this.startPythonScript(
                    () => {
                        console.log('✅ AI Server started with Python fallback');
                        resolve();
                    },
                    (pythonError) => {
                        console.error('❌ Both executable and Python failed');
                        console.error('Python error:', pythonError.message);
                        reject(new Error('Failed to start AI server with both executable and Python'));
                    }
                );
            }
        );
    }

    startPythonScript(resolve, reject) {
        const { app } = require('electron');
        let modelPath, scriptPath;
        
        if (app.isPackaged) {
            // Production - use bundled resources
            modelPath = path.join(process.resourcesPath, 'model');
            scriptPath = path.join(modelPath, 'inference_api.py');
        } else {
            // Development - use local files
            modelPath = path.join(__dirname, 'model');
            scriptPath = path.join(modelPath, 'inference_api.py');
        }
        
        console.log('Starting AI server with Python script...');
        console.log('Model path:', modelPath);
        console.log('Script path:', scriptPath);
        
        this.aiProcess = spawn('python', [scriptPath], {
            cwd: modelPath,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        this.setupProcessHandlers(resolve, reject);
    }

    startExecutable(resolve, reject) {
        const { app } = require('electron');
        let exePath;
        
        if (app.isPackaged) {
            // Production - use bundled executable in resources
            exePath = path.join(process.resourcesPath, 'ai-server', 'aetherflow-ai-server.exe');
        } else {
            // Development - use local build
            exePath = path.join(__dirname, 'ai-server', 'aetherflow-ai-server.exe');
        }
        
        if (!fs.existsSync(exePath)) {
            console.error('AI server executable not found:', exePath);
            reject(new Error('AI server executable not found'));
            return;
        }

        console.log('Starting AI server executable:', exePath);
        this.aiProcess = spawn(exePath, [], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        this.setupProcessHandlers(resolve, reject);
    }

    setupProcessHandlers(resolve, reject) {
        let startupTimeout = setTimeout(() => {
            reject(new Error('AI server startup timeout'));
        }, 30000); // 30 second timeout

        this.aiProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log('AI Server:', output);
            
            // Check for server startup messages
            if (output.includes('Uvicorn running on') || 
                output.includes('Running on') || 
                output.includes('Application startup complete')) {
                clearTimeout(startupTimeout);
                this.serverReady = true;
                console.log('✅ AI Server is ready!');
                resolve();
            }
        });

        this.aiProcess.stderr.on('data', (data) => {
            const output = data.toString();
            console.error('AI Server Error:', output);
            
            // IMPORTANT: Also check stderr for startup messages since uvicorn logs there
            if (output.includes('Uvicorn running on') || 
                output.includes('Application startup complete') ||
                output.includes('Model loaded successfully')) {
                clearTimeout(startupTimeout);
                this.serverReady = true;
                console.log('✅ AI Server is ready!');
                resolve();
            }
        });

        this.aiProcess.on('error', (error) => {
            console.error('Failed to start AI server:', error);
            clearTimeout(startupTimeout);
            reject(error);
        });

        this.aiProcess.on('close', (code) => {
            console.log(`AI server process exited with code ${code}`);
            this.serverReady = false;
        });
    }

    async waitForServer() {
        if (this.serverReady) return true;
        
        // Test if server is responding on both localhost and 127.0.0.1
        const maxAttempts = 20;
        for (let i = 0; i < maxAttempts; i++) {
            try {
                // Try localhost first
                const response = await fetch('http://localhost:8000/health');
                if (response.ok) {
                    this.serverReady = true;
                    return true;
                }
            } catch (error) {
                // Try 127.0.0.1 as fallback
                try {
                    const response = await fetch('http://127.0.0.1:8000/health');
                    if (response.ok) {
                        this.serverReady = true;
                        return true;
                    }
                } catch (error) {
                    // Server not ready yet
                }
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return false;
    }

    stopAIServer() {
        if (this.aiProcess) {
            console.log('Stopping AI server...');
            this.aiProcess.kill();
            this.aiProcess = null;
            this.serverReady = false;
        }
    }
}

module.exports = AIServerManager;
