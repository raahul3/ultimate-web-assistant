# 🚀 Installation Guide

## 🎯 Quick Start (2 Minutes)

### ✅ Prerequisites
- **Python 3.8+** installed on your system
- **Google Chrome** browser
- **Perplexity API Key** (get from [perplexity.ai](https://perplexity.ai))

---

## 🚀 Automatic Installation (Recommended)

### **For Windows:**
```bash
# 1. Download and extract the project
# 2. Double-click this file:
setup/install.bat
```

### **For Mac/Linux:**
```bash
# 1. Download and extract the project
# 2. Run in terminal:
chmod +x setup/install.sh
./setup/install.sh
```

---

## 🔧 Manual Installation

### **Step 1: Setup Python Backend**

1. **Navigate to backend folder:**
   ```bash
   cd python_backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure API Key:**
   ```bash
   # Copy the example config
   cp config_local.py.example config_local.py
   
   # Edit config_local.py and add your Perplexity API key
   ```

4. **Start the server:**
   ```bash
   python simple_server.py
   ```

   ✅ **Server running at:** `http://localhost:5000`

---

### **Step 2: Install Chrome Extension**

1. **Open Chrome Extensions:**
   - Go to `chrome://extensions/`
   - Or: Chrome menu → More tools → Extensions

2. **Enable Developer Mode:**
   - Toggle "Developer mode" in the top-right corner

3. **Load Extension:**
   - Click "Load unpacked"
   - Select the `chrome_extension` folder
   - Extension icon should appear in toolbar

4. **Test Installation:**
   - Visit any website
   - Look for the floating 🌟 button
   - Click it to open your AI assistant!

---

## 🔑 API Key Setup

### **Get Perplexity API Key:**
1. Go to [perplexity.ai](https://perplexity.ai)
2. Sign up/login to your account
3. Navigate to API settings
4. Generate a new API key
5. Copy the key (starts with `pplx-`)

### **Configure the Key:**
```python
# In python_backend/config_local.py
class LocalConfig:
    PERPLEXITY_API_KEY = "pplx-your-actual-api-key-here"
```

---

## ⚙️ Configuration Options

### **Server Settings:**
```python
# In config_local.py
class LocalConfig:
    PERPLEXITY_API_KEY = "your-key"
    PERPLEXITY_MODEL = "sonar-pro-online"  # AI model
    MAX_TOKENS = 1500                      # Response length
    TEMPERATURE = 0.7                      # Creativity (0-1)
    SERVER_PORT = 5000                     # Port number
    DEBUG_MODE = True                      # Development mode
```

### **Extension Permissions:**
The extension requests these permissions:
- **activeTab**: Access current webpage
- **storage**: Save your preferences
- **scripting**: Inject AI interface
- **tabs**: Navigate and screenshot
- **notifications**: Success/error alerts

---

## 📝 Usage Examples

### **Basic Chat:**
1. Click the 🌟 floating button
2. Type: "What is this page about?"
3. Get AI analysis instantly!

### **Page Analysis:**
- Click "Analyze Page" button
- Get content statistics and insights
- Export data as JSON

### **Research:**
- Type topic in research box
- Get comprehensive AI research
- Include sources and references

### **Screenshot:**
- Click screenshot button
- Automatically downloaded to your computer

---

## 🔧 Troubleshooting

### **Server Issues:**

**Problem:** `ModuleNotFoundError`
```bash
# Solution:
pip install -r requirements.txt
```

**Problem:** `Port already in use`
```python
# Solution: Change port in config_local.py
SERVER_PORT = 5001
```

**Problem:** `API key not configured`
```python
# Solution: Add key to config_local.py
PERPLEXITY_API_KEY = "pplx-your-key"
```

### **Extension Issues:**

**Problem:** Extension not loading
- Enable "Developer mode" in Chrome
- Reload the extension
- Check Chrome console for errors

**Problem:** 🌟 Button not appearing
- Refresh the webpage
- Check if URL is blocked by Chrome
- Ensure content script is injected

**Problem:** AI not responding
- Check if Flask server is running
- Verify API key configuration
- Check browser console for errors

---

## 📊 Features Overview

### **🌟 Core Features:**
- ✅ Works on **every website**
- ✅ **Real-time AI chat** about any page
- ✅ **Page analysis** with statistics
- ✅ **Content extraction** and export
- ✅ **Screenshot capture**
- ✅ **Research assistant**

### **🔥 Advanced Features:**
- ✅ **Context-aware responses**
- ✅ **Multiple export formats**
- ✅ **Customizable settings**
- ✅ **Privacy-focused** (your data stays local)
- ✅ **Open source** (modify as needed)

---

## 👥 Support

### **Need Help?**
- **Dashboard**: Visit `http://localhost:5000` for server status
- **Test API**: Use the built-in API test tool
- **Check Logs**: View console in Chrome DevTools
- **Configuration**: Modify `config_local.py` for customization

### **Common Questions:**

**Q: Is this safe to use?**  
A: Yes! All code is open source, your data stays local, and you control your own API key.

**Q: Does it work on all websites?**  
A: Yes! Unlike Comet, there are no blocked domains or restrictions.

**Q: Can I modify it?**  
A: Absolutely! It's open source - customize however you want.

**Q: What about my privacy?**  
A: Your browsing data stays on your computer. Only text you explicitly send is processed by AI.

---

## 🎉 Success!

Once installed, you'll have:
- ✅ **AI assistant on every website**
- ✅ **Powerful analysis tools**
- ✅ **Research capabilities**
- ✅ **Data export features**
- ✅ **Complete privacy control**

**Perfect for students, researchers, and entrepreneurs!** 🚀

---

### 🔄 Updates
To update your installation:
1. Pull latest changes from GitHub
2. Restart the Flask server
3. Reload the Chrome extension

**Your Ultimate Web Assistant is ready! 🌟**