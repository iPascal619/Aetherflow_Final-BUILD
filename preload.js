// Preload script for AetherFlow Electron app
// This script runs in the renderer process and exposes safe APIs to the web content

const { contextBridge, ipcRenderer } = require('electron');

// Expose storage APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Storage operations
    store: {
        set: (key, value) => ipcRenderer.invoke('store-set', key, value),
        get: (key) => ipcRenderer.invoke('store-get', key),
        delete: (key) => ipcRenderer.invoke('store-delete', key),
        clear: () => ipcRenderer.invoke('store-clear')
    },
    
    // System information
    system: {
        getStoragePath: () => ipcRenderer.invoke('get-storage-path'),
        getPlatform: () => process.platform,
        isElectron: () => true
    },
    
    // Data management
    data: {
        backup: () => ipcRenderer.invoke('backup-aetherflow-data'),
        restore: (data) => ipcRenderer.invoke('restore-aetherflow-data', data)
    },
    
    // AI services
    ai: {
        isApiServerRunning: () => ipcRenderer.invoke('check-api-server'),
        isModelReady: () => ipcRenderer.invoke('check-model-ready')
    },
    
    // Version info
    versions: {
        node: () => process.versions.node,
        chrome: () => process.versions.chrome,
        electron: () => process.versions.electron
    }
});

// Log that preload script has loaded
console.log('AetherFlow Electron preload script loaded');
console.log('Platform:', process.platform);
console.log('Electron version:', process.versions.electron);
