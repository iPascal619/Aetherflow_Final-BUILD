// Electron Storage Adapter for AetherFlow
// This file handles data storage for both web and Electron environments

class AetherFlowStorage {
    constructor() {
        this.isElectron = this.detectElectron();
        this.store = null;
        this.initializeStorage();
    }

    detectElectron() {
        return typeof window !== 'undefined' && 
               window.electronAPI && 
               window.electronAPI.system && 
               window.electronAPI.system.isElectron();
    }

    initializeStorage() {
        if (this.isElectron) {
            // Electron environment - use electronAPI
            this.store = {
                set: (key, value) => window.electronAPI.store.set(key, value),
                get: (key) => window.electronAPI.store.get(key),
                delete: (key) => window.electronAPI.store.delete(key),
                clear: () => window.electronAPI.store.clear()
            };
        } else {
            // Web environment - use localStorage
            this.store = {
                set: (key, value) => {
                    localStorage.setItem(key, JSON.stringify(value));
                    return Promise.resolve();
                },
                get: (key) => {
                    const item = localStorage.getItem(key);
                    return Promise.resolve(item ? JSON.parse(item) : null);
                },
                delete: (key) => {
                    localStorage.removeItem(key);
                    return Promise.resolve();
                },
                clear: () => {
                    localStorage.clear();
                    return Promise.resolve();
                }
            };
        }
    }

    // Healthcare Settings
    async saveHealthcareSettings(settings) {
        await this.store.set('aetherflow_healthcare_settings', settings);
        console.log('Healthcare settings saved to:', this.isElectron ? 'Electron store' : 'localStorage');
    }

    async getHealthcareSettings() {
        return await this.store.get('aetherflow_healthcare_settings');
    }

    // Patient Data
    async savePatients(patients) {
        await this.store.set('aetherflow_patients', patients);
    }

    async getPatients() {
        return await this.store.get('aetherflow_patients') || [];
    }

    // Assessment Data
    async saveAssessments(assessments) {
        await this.store.set('aetherflow_assessments', assessments);
    }

    async getAssessments() {
        return await this.store.get('aetherflow_assessments') || [];
    }

    // Application Mode
    async setMode(mode) {
        await this.store.set('aetherflow_mode', mode);
    }

    async getMode() {
        return await this.store.get('aetherflow_mode') || 'single';
    }

    // Data Migration
    async migrateFromLocalStorage() {
        if (this.isElectron && typeof localStorage !== 'undefined') {
            console.log('Migrating data from localStorage to Electron store...');
            
            const keysToMigrate = [
                'aetherflow_healthcare_settings',
                'aetherflow_patients',
                'aetherflow_assessments',
                'aetherflow_mode',
                'aetherflow_common_settings'
            ];

            for (const key of keysToMigrate) {
                const value = localStorage.getItem(key);
                if (value) {
                    try {
                        const parsedValue = JSON.parse(value);
                        await this.store.set(key, parsedValue);
                        console.log(`Migrated ${key} to Electron store`);
                    } catch (error) {
                        console.error(`Failed to migrate ${key}:`, error);
                    }
                }
            }
            
            console.log('Migration completed');
        }
    }

    // Backup and Restore
    async exportData() {
        const data = {
            healthcareSettings: await this.getHealthcareSettings(),
            patients: await this.getPatients(),
            assessments: await this.getAssessments(),
            mode: await this.getMode(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        return JSON.stringify(data, null, 2);
    }

    async importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.healthcareSettings) {
                await this.saveHealthcareSettings(data.healthcareSettings);
            }
            
            if (data.patients) {
                await this.savePatients(data.patients);
            }
            
            if (data.assessments) {
                await this.saveAssessments(data.assessments);
            }
            
            if (data.mode) {
                await this.setMode(data.mode);
            }
            
            console.log('Data imported successfully');
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }

    // Get storage info
    getStorageInfo() {
        return {
            type: this.isElectron ? 'electron-store' : 'localStorage',
            location: this.isElectron ? 'User data directory' : 'Browser storage',
            persistent: true,
            crossDevice: false
        };
    }
}

// Global instance
window.aetherFlowStorage = new AetherFlowStorage();

// Auto-migrate on initialization in Electron
if (window.aetherFlowStorage.isElectron) {
    window.aetherFlowStorage.migrateFromLocalStorage();
}
