# AetherFlow Electron Desktop App Setup Guide

## Prerequisites

1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version

2. **Python 3.8+** (required for AI backend)
   - Download from: https://python.org/
   - Make sure to check "Add Python to PATH" during installation

## Setup Instructions

### 1. Install Node.js Dependencies

Open PowerShell in the project directory and run:

```powershell
# Install Electron and build tools
npm install
```

If you get permission errors, try:
```powershell
# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then install
npm install
```

### 2. Install Python Dependencies

```powershell
# Create virtual environment (optional but recommended)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install Python packages
pip install -r model\requirements.txt
```

### 3. Test the App in Development

```powershell
# Run the app in development mode
npm start
```

This will:
- Start the Electron app
- Automatically start the Python AI server
- Show a splash screen while loading
- Open the main AetherFlow interface

### 4. Build Distributable App

#### For Windows (.exe installer):
```powershell
npm run build-win
```

#### For all platforms:
```powershell
npm run build
```

#### For specific platforms:
```powershell
npm run build-mac    # macOS
npm run build-linux  # Linux
```

### 5. Find Your Built App

After building, you'll find the installer in:
- `dist/` folder
- Windows: `AetherFlow Setup 1.0.0.exe`
- macOS: `AetherFlow-1.0.0.dmg`
- Linux: `AetherFlow-1.0.0.AppImage`

## App Features

### ✅ **What the Electron App Provides:**

1. **Native Desktop Experience**
   - Looks and feels like a real desktop application
   - System tray integration
   - Native menus and shortcuts

2. **Cross-Platform Support**
   - Windows (.exe installer)
   - macOS (.dmg package)
   - Linux (.AppImage)

3. **Offline Capability**
   - Bundles Python environment
   - Includes all AI models
   - No internet required after installation

4. **Professional Features**
   - Auto-updater ready
   - Native notifications
   - File association support
   - Desktop shortcuts

5. **Security**
   - Sandboxed web content
   - Secure Python backend
   - No external network calls

### 🎯 **User Experience:**

1. **Installation**
   - Double-click installer
   - Follow setup wizard
   - Creates desktop shortcut

2. **Running**
   - Click desktop icon
   - Splash screen shows while AI loads
   - Main app opens automatically

3. **Usage**
   - Full AetherFlow interface
   - All features work offline
   - Native window controls

## Distribution

### **For End Users:**

1. **Download** the installer file (e.g., `AetherFlow Setup 1.0.0.exe`)
2. **Run** the installer
3. **Follow** the installation wizard
4. **Launch** from desktop shortcut or Start menu

### **Requirements for End Users:**
- Windows 10/11 (for Windows build)
- ~200MB disk space
- No Python installation needed (bundled)
- No internet connection needed

## Troubleshooting

### **Build Issues:**

1. **Node.js not found:**
   ```powershell
   # Check Node.js installation
   node --version
   npm --version
   ```

2. **Python errors:**
   ```powershell
   # Verify Python installation
   python --version
   pip --version
   ```

3. **Permission errors:**
   ```powershell
   # Run PowerShell as Administrator
   Set-ExecutionPolicy RemoteSigned
   ```

### **Runtime Issues:**

1. **App won't start:**
   - Check if Python is in system PATH
   - Verify model files exist in `model/` directory

2. **AI server errors:**
   - Check console output in development mode
   - Verify all Python dependencies are installed

## Advanced Configuration

### **Customizing the App:**

1. **App Icon:**
   - Replace `images/logo.png` with your icon
   - For Windows: also create `images/logo.ico`

2. **App Information:**
   - Edit `package.json` for app details
   - Modify `electron-main.js` for behavior

3. **Build Settings:**
   - Configure `package.json` → `build` section
   - Add code signing for distribution

### **Adding Features:**

1. **Auto-updater**
2. **System notifications**
3. **Menu customization**
4. **Keyboard shortcuts**

This setup creates a professional, distributable desktop application that your users can install and run like any other desktop software!
