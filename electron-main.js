const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const AIServerManager = require('./ai-server-manager');

// Initialize AI Server Manager
const aiServerManager = new AIServerManager();

// Add electron-store for persistent data storage
let Store;
try {
    Store = require('electron-store');
} catch (error) {
    console.warn('electron-store not found. Install with: npm install electron-store');
    Store = null;
}

// AI API Server process
let apiServerProcess = null;

// Python AI model process
let pythonModelProcess = null;

// Initialize electron-store for AetherFlow data
let aetherFlowStore = null;
if (Store) {
    aetherFlowStore = new Store({
        name: 'aetherflow-data',
        cwd: app.getPath('userData'),
        fileExtension: 'json',
        clearInvalidConfig: true,
        defaults: {
            aetherflow_mode: 'single',
            aetherflow_healthcare_settings: null,
            aetherflow_patients: [],
            aetherflow_assessments: [],
            aetherflow_common_settings: {}
        }
    });
    
    console.log('AetherFlow data will be stored at:', aetherFlowStore.path);
}

// Storage IPC handlers for AetherFlow
if (aetherFlowStore) {
    ipcMain.handle('store-set', (event, key, value) => {
        try {
            aetherFlowStore.set(key, value);
            console.log(`AetherFlow: Stored data for key: ${key}`);
            return { success: true };
        } catch (error) {
            console.error(`AetherFlow: Failed to store data for key ${key}:`, error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('store-get', (event, key) => {
        try {
            const value = aetherFlowStore.get(key);
            return value;
        } catch (error) {
            console.error(`AetherFlow: Failed to get data for key ${key}:`, error);
            return null;
        }
    });

    ipcMain.handle('store-delete', (event, key) => {
        try {
            aetherFlowStore.delete(key);
            console.log(`AetherFlow: Deleted data for key: ${key}`);
            return { success: true };
        } catch (error) {
            console.error(`AetherFlow: Failed to delete data for key ${key}:`, error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('store-clear', (event) => {
        try {
            aetherFlowStore.clear();
            console.log('AetherFlow: Cleared all stored data');
            return { success: true };
        } catch (error) {
            console.error('AetherFlow: Failed to clear store:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('get-storage-path', (event) => {
        return {
            userData: app.getPath('userData'),
            storePath: aetherFlowStore.path,
            platform: process.platform
        };
    });

    ipcMain.handle('backup-aetherflow-data', (event) => {
        try {
            const allData = aetherFlowStore.store;
            return {
                success: true,
                data: allData,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
        } catch (error) {
            console.error('AetherFlow: Failed to backup data:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('restore-aetherflow-data', (event, data) => {
        try {
            // Clear existing data
            aetherFlowStore.clear();
            
            // Set new data
            for (const [key, value] of Object.entries(data)) {
                aetherFlowStore.set(key, value);
            }
            
            console.log('AetherFlow: Data restored successfully');
            return { success: true };
        } catch (error) {
            console.error('AetherFlow: Failed to restore data:', error);
            return { success: false, error: error.message };
        }
    });
}

// Check if Python is available and find the correct Python executable
function findPython() {
    return new Promise((resolve) => {
        const pythonCommands = ['python', 'python3', 'py', 'python.exe'];
        let pythonFound = null;
        let index = 0;

        function tryNext() {
            if (index >= pythonCommands.length) {
                resolve(null);
                return;
            }

            const pythonCmd = pythonCommands[index];
            const python = spawn(pythonCmd, ['--version']);
            
            python.on('close', (code) => {
                if (code === 0) {
                    pythonFound = pythonCmd;
                    resolve(pythonCmd);
                } else {
                    index++;
                    tryNext();
                }
            });
            
            python.on('error', (error) => {
                // Silently try next Python command
                index++;
                tryNext();
            });
        }

        tryNext();
    });
}

// Install Python dependencies
function installDependencies(pythonCmd) {
    return new Promise((resolve, reject) => {
        const pip = spawn(pythonCmd, ['-m', 'pip', 'install', '-r', 'model/requirements.txt'], {
            cwd: __dirname
        });
        
        pip.stdout.on('data', (data) => {
            console.log('Pip install:', data.toString());
        });
        
        pip.stderr.on('data', (data) => {
            console.error('Pip install error:', data.toString());
        });
        
        pip.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error('Failed to install dependencies'));
            }
        });
        
        pip.on('error', (err) => {
            console.warn(`⚠️ Python pip not available: ${err.message}`);
            resolve(); // Don't crash, just continue without dependencies
        });
    });
}

// Create splash screen
function createSplash() {
    splashWindow = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        webPreferences: {
            nodeIntegration: false
        }
    });

    splashWindow.loadFile('splash.html');
    
    splashWindow.on('closed', () => {
        splashWindow = null;
    });
}

// Create main application window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true
        },
        icon: path.join(__dirname, 'images/logo.png'),
        titleBarStyle: 'default'
    });

    // Set application menu
    createMenu();

    // Load the mode selection page first
    mainWindow.loadFile('mode-selection.html');

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        if (splashWindow) {
            splashWindow.close();
        }
        mainWindow.show();
        
        // Focus on the window
        mainWindow.focus();
    });

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
        // Kill Python processes when window closes
        if (apiServer) {
            apiServer.kill('SIGTERM');
        }
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

// Create application menu
function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Assessment',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.webContents.send('navigate-to', 'symptom_check.html');
                    }
                },
                {
                    label: 'Dashboard',
                    accelerator: 'CmdOrCtrl+D',
                    click: () => {
                        mainWindow.webContents.send('navigate-to', 'dashboard.html');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About AetherFlow',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About AetherFlow',
                            message: 'AetherFlow v1.0.0',
                            detail: 'Sickle Cell Crisis Risk Assessment System\n\n⚠️ This is a research prototype and educational tool.\nNot intended for clinical use or medical diagnosis.\nAlways consult qualified healthcare professionals.'
                        });
                    }
                },
                {
                    label: 'Learn More',
                    click: () => {
                        shell.openExternal('https://github.com/aetherflow/aetherflow');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// Start Python AI server
async function startPythonServer(pythonCmd) {
    return new Promise((resolve, reject) => {
        // Check if model files exist
        const modelPath = path.join(__dirname, 'model', 'inference_api.py');
        if (!fs.existsSync(modelPath)) {
            reject(new Error('AI model files not found'));
            return;
        }

        // Start the server
        try {
            apiServer = spawn(pythonCmd, ['model/inference_api.py'], {
                cwd: __dirname,
                stdio: ['pipe', 'pipe', 'pipe']
            });
        } catch (spawnError) {
            reject(new Error(`Failed to spawn Python process: ${spawnError.message}`));
            return;
        }

        let serverReady = false;

        // Monitor server output
        apiServer.stdout.on('data', (data) => {
            const output = data.toString();
            console.log('AI Server:', output);
            
            // Check if server is ready
            if (output.includes('Uvicorn running') || output.includes('Application startup complete')) {
                if (!serverReady) {
                    serverReady = true;
                    resolve();
                }
            }
        });

        apiServer.stderr.on('data', (data) => {
            const output = data.toString();
            console.error('AI Server Error:', output);
            
            // Check if server is ready (Uvicorn messages appear in stderr)
            if (output.includes('Uvicorn running') || output.includes('Application startup complete') || output.includes('Started server process')) {
                if (!serverReady) {
                    serverReady = true;
                    resolve();
                }
            }
        });

        apiServer.on('close', (code) => {
            console.log(`AI Server exited with code ${code}`);
            if (code !== 0 && !serverReady) {
                console.warn(`⚠️ AI Server failed to start (exit code: ${code})`);
                resolve(); // Don't crash the app
            }
        });

        apiServer.on('error', (err) => {
            console.warn('⚠️ Failed to start AI server:', err.message);
            resolve(); // Don't crash the app
        });

        // Timeout after 30 seconds
        setTimeout(() => {
            if (!serverReady) {
                console.warn('⚠️ AI Server startup timeout');
                resolve(); // Don't crash the app
            }
        }, 30000);
    });
}

// Optional Python components initialization (won't crash app if Python missing)
async function initializePythonComponentsOptionally() {
    try {
        console.log('🐍 Checking for Python installation...');
        
        // Find Python installation
        const pythonCmd = await findPython();
        if (!pythonCmd) {
            console.warn('⚠️ Python not found - AI model features will be disabled');
            console.warn('📝 Install Python 3.8+ from https://python.org for full AI features');
            return false;
        }

        console.log(`✅ Found Python: ${pythonCmd}`);

        // Install dependencies (optional)
        try {
            await installDependencies(pythonCmd);
        } catch (depError) {
            console.warn('⚠️ Failed to install Python dependencies:', depError.message);
        }

        // Start Python server (optional)
        try {
            await startPythonServer(pythonCmd);
            console.log('✅ Python server started successfully');
            return true;
        } catch (serverError) {
            console.warn('⚠️ Failed to start Python server:', serverError.message);
            return false;
        }

    } catch (error) {
        console.warn('⚠️ Python initialization failed:', error.message);
        return false;
    }
}

// Optional AI services initialization (graceful failure)
async function initializeAIServicesOptionally() {
    try {
        // Start Node.js API server for AI companion (optional)
        try {
            await startAPIServerOptionally();
        } catch (apiError) {
            console.warn('⚠️ API server initialization failed:', apiError.message);
        }
        
        // Initialize Python AI model for crisis prediction (optional)
        try {
            await initializePythonModelOptionally();
        } catch (modelError) {
            console.warn('⚠️ Python model initialization failed:', modelError.message);
        }
        
        console.log('🔧 AI services initialization completed (some features may be limited)');
    } catch (error) {
        console.warn('⚠️ AI services initialization failed:', error.message);
    }
}

// Optional API server start (won't crash if Node.js issues)
async function startAPIServerOptionally() {
    return new Promise((resolve, reject) => {
        console.log('🌐 Attempting to start AetherFlow API server...');
        
        const apiPath = path.join(__dirname, 'api');
        
        // Check if API directory exists
        if (!fs.existsSync(apiPath)) {
            console.warn('⚠️ API directory not found, AI companion features disabled');
            resolve();
            return;
        }
        
        try {
            apiServerProcess = spawn('node', ['server.js'], {
                cwd: apiPath,
                stdio: ['pipe', 'pipe', 'pipe']
            });
            
            let serverStarted = false;
            
            apiServerProcess.stdout.on('data', (data) => {
                const message = data.toString().trim();
                console.log(`API Server: ${message}`);
                
                // Look for server started indication
                if (message.includes('Server running') || message.includes('listening')) {
                    serverStarted = true;
                }
            });
            
            apiServerProcess.stderr.on('data', (data) => {
                const message = data.toString().trim();
                if (!message.includes('DeprecationWarning') && !message.includes('ExperimentalWarning')) {
                    console.warn(`API Server Warning: ${message}`);
                }
            });
            
            apiServerProcess.on('error', (error) => {
                console.warn('API Server spawn error:', error.message);
                resolve(); // Don't reject, just resolve without API server
            });
            
            apiServerProcess.on('close', (code) => {
                if (code !== 0) {
                    console.warn(`API Server exited with code ${code}`);
                }
            });
            
            // Give the server time to start, then resolve regardless
            setTimeout(() => {
                if (serverStarted || apiServerProcess.pid) {
                    console.log('✅ API server started successfully');
                } else {
                    console.warn('⚠️ API server may not have started properly (timeout)');
                }
                resolve();
            }, 3000);
            
        } catch (error) {
            console.warn('Failed to start API server:', error.message);
            resolve(); // Don't reject, app should still work
        }
    });
}

// Optional Python AI model initialization (won't crash if Python issues)
async function initializePythonModelOptionally() {
    return new Promise(async (resolve, reject) => {
        console.log('🧠 Attempting to initialize Python AI model...');
        
        try {
            const modelPath = path.join(__dirname, 'model');
            
            // Check if model directory exists
            if (!fs.existsSync(modelPath)) {
                console.warn('⚠️ Model directory not found, AI prediction features disabled');
                resolve();
                return;
            }
            
            // First check if Python is available
            const pythonCmd = await findPython();
            if (!pythonCmd) {
                console.warn('⚠️ Python not found, AI prediction features disabled');
                resolve();
                return;
            }
            
            // Check if trained model exists
            const modelFile = path.join(modelPath, 'sickle_cell_model.joblib');
            if (!fs.existsSync(modelFile)) {
                console.log('📚 No trained model found, attempting to train...');
                
                // Try to train the model
                try {
                    pythonModelProcess = spawn(pythonCmd, ['train_model.py'], {
                        cwd: modelPath,
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                } catch (spawnError) {
                    console.warn('⚠️ Failed to spawn Python training process:', spawnError.message);
                    resolve();
                    return;
                }
                
                let trainingOutput = '';
                
                pythonModelProcess.stdout.on('data', (data) => {
                    const message = data.toString().trim();
                    trainingOutput += message + '\n';
                    console.log(`Model Training: ${message}`);
                });
                
                pythonModelProcess.stderr.on('data', (data) => {
                    const message = data.toString().trim();
                    if (!message.includes('FutureWarning') && !message.includes('UserWarning') && !message.includes('DeprecationWarning')) {
                        console.warn(`Model Training Warning: ${message}`);
                    }
                });
                
                pythonModelProcess.on('close', (code) => {
                    if (code === 0) {
                        console.log('✅ Python AI model trained and ready');
                        resolve();
                    } else {
                        console.warn(`⚠️ Model training completed with exit code ${code}`);
                        console.warn('AI prediction features may be limited');
                        resolve(); // Don't crash the app
                    }
                });
                
                pythonModelProcess.on('error', (error) => {
                    console.warn('Python model spawn error:', error.message);
                    resolve(); // Don't crash the app
                });
                
                // Timeout for training
                setTimeout(() => {
                    if (pythonModelProcess && !pythonModelProcess.killed) {
                        console.warn('⚠️ Model training timeout - continuing without trained model');
                        pythonModelProcess.kill();
                        resolve();
                    }
                }, 60000); // 1 minute timeout
                
            } else {
                console.log('✅ Found existing trained model, Python AI ready');
                resolve();
            }
            
        } catch (error) {
            console.warn('Failed to initialize Python model:', error.message);
            resolve(); // Don't crash the app
        }
    });
}

// Cleanup function for AI services
function cleanupAIServices() {
    console.log('🧹 Cleaning up AI services...');
    
    if (apiServerProcess) {
        console.log('Stopping API server...');
        apiServerProcess.kill();
        apiServerProcess = null;
    }
    
    if (pythonModelProcess) {
        console.log('Stopping Python model process...');
        pythonModelProcess.kill();
        pythonModelProcess = null;
    }
}

// App event handlers
app.whenReady().then(async () => {
    // Create splash screen
    createSplash();

    try {
        console.log('🚀 Starting AetherFlow...');
        
        // Start AI Server (bundled or development)
        try {
            console.log('🤖 Starting AI server...');
            await aiServerManager.startAIServer();
            console.log('✅ AI server started successfully!');
        } catch (aiError) {
            console.warn('⚠️ AI server unavailable:', aiError.message);
        }
        
        // Try to initialize Python components (optional - now handled by AI server manager)
        try {
            await initializePythonComponentsOptionally();
        } catch (pythonError) {
            console.warn('⚠️ Python components unavailable:', pythonError.message);
        }
        
        // Initialize AI services (gracefully handle failures)
        try {
            console.log('🤖 Initializing AetherFlow enhanced features...');
            await initializeAIServicesOptionally();
        } catch (aiError) {
            console.warn('⚠️ AI services unavailable:', aiError.message);
        }

        // Create main window
        createMainWindow();

        console.log('🎉 AetherFlow successfully initialized!');

    } catch (error) {
        console.error('Startup error:', error);
        
        if (splashWindow) {
            splashWindow.close();
        }

        // Show error but still try to start basic app
        console.warn('Some features may not be available due to initialization errors');
        
        // Try to start in basic mode
        try {
            createMainWindow();
            console.log('🔧 AetherFlow started in basic mode (some AI features disabled)');
        } catch (basicError) {
            console.error('Failed to start even in basic mode:', basicError);
            dialog.showErrorBox('AetherFlow Startup Error', 
                `Failed to start AetherFlow:\n\n${basicError.message}\n\nPlease restart the application.`);
            app.quit();
        }
    }
});

app.on('window-all-closed', () => {
    // Kill Python processes
    if (apiServer) {
        apiServer.kill('SIGTERM');
    }
    
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

app.on('before-quit', () => {
    // Cleanup AI server
    aiServerManager.stopAIServer();
    
    // Cleanup Python processes
    if (apiServer) {
        apiServer.kill('SIGTERM');
    }
    
    // Cleanup AI services
    cleanupAIServices();
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        shell.openExternal(navigationUrl);
    });
});    // AI service status handlers
    ipcMain.handle('check-api-server', (event) => {
        return {
            running: apiServerProcess !== null && !apiServerProcess.killed,
            port: 3001,
            status: apiServerProcess ? 'running' : 'stopped',
            available: apiServerProcess !== null
        };
    });
    
    ipcMain.handle('check-model-ready', (event) => {
        const modelPath = path.join(__dirname, 'model', 'sickle_cell_model.joblib');
        return {
            ready: fs.existsSync(modelPath),
            modelPath: modelPath,
            trainingProcess: pythonModelProcess !== null && !pythonModelProcess.killed,
            available: fs.existsSync(path.join(__dirname, 'model'))
        };
    });
