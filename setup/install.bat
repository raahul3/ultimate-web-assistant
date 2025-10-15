@echo off
REM 🌟 Ultimate Web Assistant - Installation Script for Windows

echo 🚀 Installing Ultimate Web Assistant...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is required but not installed.
    echo Please install Python from https://python.org and try again.
    pause
    exit /b 1
)

REM Install Python dependencies
echo 📦 Installing Python dependencies...
cd python_backend
pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ Failed to install Python dependencies.
    pause
    exit /b 1
)

echo ✅ Python dependencies installed successfully!

REM Start the server
echo 🔥 Starting Flask server...
start "Web Assistant Server" python simple_server.py

echo ✅ Flask server started!
echo 🌐 Dashboard available at: http://localhost:5000
echo.

echo 🎯 Next Steps:
echo 1. Open Chrome and go to chrome://extensions/
echo 2. Enable 'Developer mode' (top right toggle)
echo 3. Click 'Load unpacked'
echo 4. Select the 'chrome_extension' folder
echo 5. Visit any website and click the 🌟 button!
echo.
echo 🎉 Installation complete! Your AI assistant is ready!

pause