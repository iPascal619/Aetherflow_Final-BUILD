# AetherFlow Startup Troubleshooting Guide

## 🚨 Common Startup Issues & Solutions

### Issue: "Failed to start AetherFlow, spawn python ENOENT"

**Cause**: Python is not installed or not found in system PATH.

**Solutions**:

#### Option 1: Quick Fix (Recommended)
The latest prototype has been updated to gracefully handle missing Python. **AetherFlow will still start** with reduced AI features.

1. **Start AetherFlow anyway** - it should now start in "basic mode"
2. **Look for this message**: "AetherFlow started in basic mode (some AI features disabled)"
3. **Test blockchain features** - these work without Python
4. **Install Python later** for full AI features

#### Option 2: Install Python (Full Features)
1. **Download Python 3.8+** from https://python.org
2. **IMPORTANT**: Check "Add Python to PATH" during installation
3. **Restart computer** after installation
4. **Test in terminal**: Open PowerShell and type `python --version`
5. **Rebuild prototype**: Run `.\build-prototype.bat` again

### Issue: "API Server failed to start"

**Cause**: Node.js API server issues or port conflicts.

**Solutions**:
1. **Check port 3001**: Make sure no other app is using port 3001
2. **Close other apps**: Stop any development servers
3. **Restart AetherFlow**: The app should work without the API server
4. **Check console**: Look for detailed error messages

### Issue: "Model training timeout"

**Cause**: Python model training is taking too long.

**Solutions**:
1. **Wait longer**: Model training can take 1-5 minutes
2. **Check console**: Look for training progress messages
3. **Skip AI training**: App works without trained model
4. **Manual training**: Run training manually in PowerShell:
   ```powershell
   cd model
   python train_model.py
   ```

## 🔧 App Startup Modes

### 🟢 Full Mode (All Features Working)
- ✅ Blockchain data integrity
- ✅ AI model predictions  
- ✅ AI health companion
- ✅ Complete audit trails
- ✅ All analytics features

**Indicators**:
- Console shows "🎉 AetherFlow fully initialized with AI and blockchain support!"
- All navigation menu items work
- AI features respond normally

### 🟡 Basic Mode (Python Missing)
- ✅ Blockchain data integrity
- ✅ Patient management
- ✅ Manual assessments
- ✅ Data export/import
- ❌ AI model predictions
- ❌ AI health companion

**Indicators**:
- Console shows "🔧 AetherFlow started in basic mode"
- Warning about Python not found
- Blockchain features work normally

### 🟡 Limited Mode (API Server Issues)
- ✅ Blockchain data integrity
- ✅ AI model predictions
- ✅ Patient management
- ❌ AI health companion
- ❌ Real-time AI chat

**Indicators**:
- Console shows API server warnings
- Core features work normally
- Chat features may not respond

## 🧪 Testing Your Installation

### Quick Health Check
1. **Launch AetherFlow**
2. **Switch to Healthcare Mode** (if not automatic)
3. **Navigate to Blockchain settings**
4. **Enable blockchain features**
5. **Run the test suite** at `test-blockchain-integration.html`

### Expected Results
- **Minimum**: Blockchain tests should pass (Tests 1-6)
- **Optimal**: All features including AI should work
- **Acceptable**: Basic mode with blockchain only

### Feature Availability Check
| Feature | Full Mode | Basic Mode | Critical? |
|---------|-----------|------------|-----------|
| Patient Management | ✅ | ✅ | YES |
| Blockchain Integrity | ✅ | ✅ | YES |
| Manual Assessments | ✅ | ✅ | YES |
| Data Export/Import | ✅ | ✅ | YES |
| AI Risk Prediction | ✅ | ❌ | NO |
| AI Health Companion | ✅ | ❌ | NO |
| Auto Risk Scoring | ✅ | ❌ | NO |

## 🔍 Diagnostic Commands

### Check Python Installation
```powershell
python --version
python -c "import pandas, numpy, scikit_learn; print('Dependencies OK')"
```

### Check Node.js Installation
```powershell
node --version
npm --version
```

### Check AetherFlow Dependencies
```powershell
cd "c:\Users\HP\Desktop\Aetherflow frontend"
npm list electron
npm list electron-store
```

### Test API Server Manually
```powershell
cd api
node server.js
# Should show server starting on port 3001
```

## 📊 Console Messages Guide

### ✅ Success Messages
- `✅ Found Python: python`
- `✅ API server started successfully`
- `✅ Python AI model trained and ready`
- `✅ Blockchain support initialized`
- `🎉 AetherFlow fully initialized`

### ⚠️ Warning Messages (OK)
- `⚠️ Python not found - AI model features will be disabled`
- `⚠️ API server initialization failed`
- `⚠️ Model training timeout - continuing without trained model`
- `🔧 AetherFlow started in basic mode`

### ❌ Error Messages (Need Action)
- `Failed to start even in basic mode`
- `Cannot read property of undefined`
- `Module not found`
- `Permission denied`

## 🛠️ Advanced Troubleshooting

### Clean Reinstall
1. **Delete dist folder**: Remove `dist\prototype`
2. **Clear npm cache**: `npm cache clean --force`
3. **Reinstall dependencies**: `npm install`
4. **Rebuild**: `.\build-prototype.bat`

### Reset User Data
1. **Close AetherFlow completely**
2. **Navigate to**: `%APPDATA%\aetherflow-data`
3. **Backup data**: Copy the folder somewhere safe
4. **Delete folder**: Remove the aetherflow-data folder
5. **Restart AetherFlow**: Will create fresh user data

### Network Issues
- **Check firewall**: Allow Node.js and Python through Windows Firewall
- **Check antivirus**: Temporarily disable to test
- **Check proxy**: Ensure proxy settings don't block local connections

## 🆘 Getting Help

### Before Reporting Issues
1. **Try basic mode**: See if core features work
2. **Check console output**: Look for specific error messages
3. **Test with fresh data**: Try resetting user data
4. **Document the issue**: Note exact error messages and steps

### Information to Include
- **Operating System**: Windows version
- **Python Version**: `python --version` output
- **Node.js Version**: `node --version` output
- **Console Output**: Copy relevant error messages
- **Steps to Reproduce**: What you were doing when it failed

### Workarounds
- **Use in basic mode**: Core healthcare features work without AI
- **Manual assessments**: Enter risk scores manually
- **Export data regularly**: Use built-in backup features
- **Browser version**: Use browser version if Electron fails

## 🎯 Key Points

1. **AetherFlow now starts even if Python is missing** - this is the most important fix
2. **Blockchain features work independently** of AI components
3. **Core healthcare functionality** is always available
4. **AI features are enhancements**, not requirements
5. **Data integrity is preserved** in all modes

The updated prototype prioritizes **reliability over features** - you can always use AetherFlow for patient management and blockchain verification, even if some AI features aren't available.

---

**Need immediate help?** Start AetherFlow, go to Blockchain settings, and run the test suite. If the blockchain tests pass, your core installation is working correctly!
