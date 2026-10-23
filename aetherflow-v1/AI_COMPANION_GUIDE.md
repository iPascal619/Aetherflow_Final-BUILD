# AetherFlow AI Companion - Enhanced Intelligence Guide

## 🤖 Overview

Your AetherFlow health companion now features **dual-mode AI intelligence**:

1. **🔧 Offline Mode**: Advanced local knowledge base for immediate responses
2. **🌐 Online Mode**: OpenAI GPT integration for enhanced intelligence (when available)

## ✨ Key Features

### 🩺 **Comprehensive Health Knowledge**
- **Symptom Analysis**: Intelligent detection and guidance for common symptoms
- **Emergency Detection**: Automatic recognition of urgent medical situations
- **Health Topics**: Nutrition, exercise, sleep, stress management, medication safety
- **Multi-language Support**: Available in English, Swahili, French, Kinyarwanda, and Pidgin

### 🧠 **Dual Intelligence System**

#### 🔧 **Offline AI (Always Available)**
- **No internet required** - works completely offline
- **Comprehensive symptom database** with smart keyword matching
- **Emergency detection system** for urgent situations
- **Health topic guidance** covering major wellness areas
- **Instant responses** - no network delays

#### 🌐 **Online AI (Enhanced Mode)**
- **OpenAI GPT integration** for more nuanced responses
- **Advanced conversation context** understanding
- **Personalized health guidance** based on conversation history
- **Real-time medical knowledge** updates
- **User-controlled**: Enable/disable in Settings

### 🛡️ **Safety Features**
- **Emergency Alert System**: Immediate guidance for life-threatening situations
- **Professional Disclaimer**: Always encourages consulting healthcare providers
- **Symptom Escalation**: Knows when to recommend professional care
- **Crisis Assessment Integration**: Links with your crisis assessment tools

## 🚀 How to Use

### **1. Access the Companion**
- Click the floating **🩺 icon** on any page
- The companion is available 24/7 across all pages

### **2. Interaction Methods**
- **Text Input**: Type your health questions
- **Voice Input**: Use the 🎤 microphone button (when supported)
- **Quick Actions**: Use preset buttons for common queries
- **Suggestions**: Click suggested responses for quick communication

### **3. Enable Enhanced Online AI**
1. Go to **Settings** page
2. Find **"Use enhanced online AI (when available)"**
3. Toggle **ON** for smarter responses
4. Requires internet connection and OpenAI API key

## 🔧 Backend Setup (For Online AI)

### **Prerequisites**
- Node.js installed on your system
- OpenAI API account (optional, for enhanced responses)

### **Quick Setup**
1. **Install Dependencies**:
   ```bash
   cd api
   npm install
   ```

2. **Configure API Key** (Optional):
   - Edit `api/.env` file
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_actual_api_key_here
     ```

3. **Start Backend**:
   ```bash
   node server.js
   ```
   ✅ Server runs on http://localhost:3001

4. **Start Frontend**:
   ```bash
   python -m http.server 8000
   ```
   ✅ App available at http://localhost:8000

## 💡 **AI Response Examples**

### **Symptom Query**
**User**: "I have a headache and feel nauseous"
**AI Response**: 
- Symptom analysis and management tips
- When to seek medical care
- Follow-up questions for better assessment
- Emergency indicators to watch for

### **Emergency Detection**
**User**: "I can't breathe properly"
**AI Response**: 
- 🚨 Immediate emergency alert
- Instructions to call emergency services
- Basic first aid guidance
- "Don't wait for medical advice" emphasis

### **General Health**
**User**: "How can I sleep better?"
**AI Response**: 
- Sleep hygiene recommendations
- Environmental factors
- Lifestyle adjustments
- When to consult a sleep specialist

## 🌍 **Language Support**

The AI companion supports full conversations in:
- **English** 🇺🇸
- **Swahili** 🇰🇪 (Kiswahili)
- **French** 🇫🇷 (Français)
- **Kinyarwanda** 🇷🇼
- **Pidgin** 🇳🇬

Switch languages in Settings - all AI responses adapt automatically!

## 🔄 **Offline vs Online Mode**

| Feature | Offline Mode | Online Mode |
|---------|-------------|-------------|
| **Availability** | ✅ Always works | ⚡ Requires internet |
| **Response Speed** | ⚡ Instant | 🔄 2-3 seconds |
| **Knowledge Depth** | 📚 Comprehensive basics | 🧠 Advanced + Current |
| **Context Memory** | 💭 Limited | 🧠 Extended |
| **Personalization** | 📋 Basic | 🎯 Advanced |
| **Privacy** | 🔒 100% Local | 🌐 Processed externally |

## 🛡️ **Privacy & Safety**

### **Data Handling**
- **Offline Mode**: All data stays on your device
- **Online Mode**: Messages processed by OpenAI (optional)
- **No Storage**: Conversations not permanently stored
- **User Control**: Toggle online AI on/off anytime

### **Medical Disclaimer**
⚠️ **Important**: This AI companion provides general health information only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.

### **Emergency Protocol**
🚨 For life-threatening emergencies:
1. **Call emergency services immediately** (911, 999, 112)
2. **Get to nearest emergency room**
3. **Don't rely solely on AI guidance**

## 🔧 **Troubleshooting**

### **AI Not Responding**
1. Check if backend server is running (port 3001)
2. Verify frontend server is running (port 8000)
3. Check browser console for errors
4. Try refreshing the page

### **Online AI Unavailable**
1. Check internet connection
2. Verify OpenAI API key in `.env` file
3. Check API quota/billing status
4. Falls back to offline mode automatically

### **Voice Input Not Working**
1. Ensure browser supports Web Speech API
2. Grant microphone permissions
3. Try Chrome/Edge browsers for best support

## 📞 **Support**

For technical issues or feature requests:
1. Check browser console for error messages
2. Verify all servers are running
3. Test with different browsers
4. Review this guide for common solutions

---

**🩺 AetherFlow - Your intelligent health companion, now with enhanced AI capabilities!**
