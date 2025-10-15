#!/bin/bash

# 🌟 Ultimate Web Assistant - Installation Script for Mac/Linux

echo "🚀 Installing Ultimate Web Assistant..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3 and try again."
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
cd python_backend
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Python dependencies installed successfully!"
else
    echo "❌ Failed to install Python dependencies."
    exit 1
fi

# Start the server in background
echo "🔥 Starting Flask server..."
python3 simple_server.py &
SERVER_PID=$!

echo "✅ Flask server started (PID: $SERVER_PID)"
echo "🌐 Dashboard available at: http://localhost:5000"
echo ""

echo "🎯 Next Steps:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' (top right toggle)"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'chrome_extension' folder"
echo "5. Visit any website and click the 🌟 button!"
echo ""
echo "🎉 Installation complete! Your AI assistant is ready!"

# Keep script running
wait $SERVER_PID