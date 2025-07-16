# AetherFlow Desktop App - Installation Guide

## 🚀 Quick Start

### Option 1: Easy Installation (Recommended)
1. **Download** `AetherFlow Setup 1.0.0.exe`
2. **Install Python** first (see below)
3. **Run** the AetherFlow installer
4. **Launch** from desktop shortcut

### Option 2: Using Setup Assistant
1. **Extract** all files from the AetherFlow package
2. **Run** `setup-aetherflow.bat` as Administrator
3. **Follow** the on-screen instructions
4. **Launch** AetherFlow when setup completes

## 🐍 Python Installation (REQUIRED)

AetherFlow needs Python to run its AI backend. Choose one method:

### Method 1: Microsoft Store (Easiest)
1. Open **Microsoft Store**
2. Search for **"Python"**
3. Install **Python 3.11** or higher
4. ✅ **Automatic PATH setup** - no configuration needed!

### Method 2: Python.org (Traditional)
1. Go to **https://python.org/downloads**
2. Download **Python 3.8** or higher
3. During installation: ⚠️ **CHECK "Add Python to PATH"**
4. Restart your computer after installation

### Method 3: Check if Already Installed
Run `check-python.bat` to see if Python is already installed.

## 🔧 Troubleshooting

### Error: "spawn python ENOENT"
**Cause**: Python not found in system PATH  
**Solution**: 
1. Install Python using Method 1 or 2 above
2. Make sure "Add Python to PATH" was checked
3. Restart your computer
4. Try running AetherFlow again

### Error: "Failed to install dependencies"
**Cause**: No internet connection or pip issues  
**Solution**:
1. Check internet connection
2. Run setup as Administrator
3. Try running `setup-aetherflow.bat`

### Error: "AI Server failed to start"
**Cause**: Missing Python packages or permission issues  
**Solution**:
1. Run `setup-aetherflow.bat` as Administrator
2. Check if antivirus is blocking the app
3. Ensure Python 3.8+ is installed

## 📱 Using AetherFlow

Once installed successfully:

1. **Launch**: Double-click desktop icon
2. **Splash Screen**: Wait for AI models to load
3. **Main Interface**: Full AetherFlow app opens
4. **Assessment**: Click "Crisis Assessment" to start
5. **Offline**: Works completely without internet

## 🔒 System Requirements

- **OS**: Windows 10/11
- **Python**: 3.8 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free space
- **Internet**: Only needed for initial setup

## 🆘 Still Having Issues?

### Quick Diagnosis
1. **Run** `check-python.bat` to verify Python
2. **Run** `setup-aetherflow.bat` to fix dependencies
3. **Restart** your computer
4. **Try** launching AetherFlow again

### Manual Python Check
Open Command Prompt and try:
```cmd
python --version
python3 --version
py --version
```
One of these should show Python 3.8+

### Reset Everything
1. Uninstall AetherFlow
2. Reinstall Python (with PATH checked)
3. Restart computer
4. Reinstall AetherFlow
5. Run `setup-aetherflow.bat`

## ✅ Success Indicators

You'll know everything is working when:
- ✅ No error messages on startup
- ✅ Splash screen shows "Initializing AI models..."
- ✅ Main AetherFlow interface opens
- ✅ Crisis Assessment page loads
- ✅ All features work offline

## 📞 Support

If you're still having issues:
1. Check that Python is installed correctly
2. Try the setup assistant script
3. Ensure you have Administrator privileges
4. Check if antivirus software is interfering

The most common issue is Python not being in the system PATH. The Microsoft Store installation method usually fixes this automatically.
