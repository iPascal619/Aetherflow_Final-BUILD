# AetherFlow Electron Data Storage Guide

## 📍 **Data Storage Locations**

### **Web Version (Browser)**
- **Location**: Browser localStorage
- **Path**: Browser-specific location
- **Persistence**: Until manually cleared or browser data cleared

### **Desktop Version (Electron)**
- **Windows**: `C:\Users\[Username]\AppData\Roaming\aetherflow-desktop\aetherflow-data.json`
- **macOS**: `~/Library/Application Support/aetherflow-desktop/aetherflow-data.json`
- **Linux**: `~/.config/aetherflow-desktop/aetherflow-data.json`

## 🗂️ **Data Structure**

The same data structure is used in both web and desktop versions:

```json
{
  "aetherflow_mode": "multi",
  "aetherflow_healthcare_settings": {
    "provider": {
      "name": "Dr. Maria Rodriguez",
      "license": "MD123456",
      "specialty": "hematology",
      "email": "maria.rodriguez@hospital.com",
      "affiliation": "City General Hospital"
    },
    "patientManagement": {
      "maxPatients": "100",
      "assessmentRetention": "365",
      "autoBackup": true,
      "patientNotifications": true,
      "generateReports": true
    },
    "aiModel": {
      "modelVersion": "v1.0",
      "confidenceThreshold": "0.8",
      "enableLogging": true
    }
  },
  "aetherflow_patients": [...],
  "aetherflow_assessments": [...],
  "aetherflow_common_settings": {...}
}
```

## 🔄 **Migration Process**

When converting from web to desktop:

1. **Automatic Migration**: The desktop app automatically detects existing localStorage data and migrates it to Electron storage
2. **Data Integrity**: All healthcare settings, patient data, and assessments are preserved
3. **Backup Created**: Original localStorage data remains intact as backup

## 🛠️ **Setup Instructions**

### **Install Dependencies**
```bash
cd "C:\Users\HP\Desktop\Aetherflow frontend"
npm install electron-store
```

### **Run Desktop App**
```bash
npm start
```

### **Build Desktop App**
```bash
# Windows executable
npm run build-win

# macOS app
npm run build-mac

# Linux AppImage
npm run build-linux
```

## 📊 **Storage Features**

### **Advantages of Electron Storage**
- ✅ **Persistent**: Data survives app restarts and system reboots
- ✅ **Secure**: Stored in user's private app data directory
- ✅ **Cross-platform**: Works consistently on Windows, macOS, and Linux
- ✅ **Backup/Restore**: Built-in data export/import functionality
- ✅ **Large Storage**: No browser storage limitations
- ✅ **Offline**: Works without internet connection

### **Data Management**
- **Automatic Backups**: Can be configured for regular backups
- **Export Function**: Export all data to JSON file
- **Import Function**: Restore data from backup file
- **Data Validation**: Ensures data integrity during operations

## 🔧 **Technical Implementation**

### **Storage Adapter**
- **File**: `js/storage-adapter.js`
- **Purpose**: Unified API for both web and desktop storage
- **Features**: Automatic environment detection, data migration, backup/restore

### **Electron Integration**
- **Main Process**: `electron-main.js` - Handles storage operations
- **Preload Script**: `preload.js` - Secure API exposure
- **IPC Communication**: Secure data transfer between processes

### **API Usage**
```javascript
// Initialize storage
const storage = new AetherFlowStorage();

// Save healthcare settings
await storage.saveHealthcareSettings(settingsData);

// Load healthcare settings
const settings = await storage.getHealthcareSettings();

// Export all data
const backupData = await storage.exportData();

// Import data
await storage.importData(backupData);
```

## 📋 **Data Safety**

### **Backup Recommendations**
1. **Regular Exports**: Use the export function monthly
2. **Cloud Backup**: Save exported files to cloud storage
3. **Version Control**: Keep multiple backup versions
4. **Test Restores**: Periodically test data restoration

### **Security Features**
- **Local Storage**: Data never leaves the user's device
- **Encryption**: File system level encryption (OS-dependent)
- **Access Control**: Only the app can access its data
- **No Network**: Data storage doesn't require internet

## 🎯 **Quick Start**

1. **Install electron-store**: `npm install electron-store`
2. **Run desktop app**: `npm start`
3. **Enter healthcare settings**: Go to Settings → Healthcare Mode
4. **Data automatically migrates**: From browser to desktop storage
5. **Verify storage location**: Check app data directory

Your healthcare provider information and all patient data will be safely stored and accessible across all pages of the desktop application!
