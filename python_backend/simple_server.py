"""
🚀 Ultimate Web Assistant - Simple Flask Server
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json
from datetime import datetime
from config import Config

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return """
<!DOCTYPE html>
<html>
<head>
    <title>🌟 Ultimate Web Assistant Dashboard</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #4f46e5;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature-card {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-5px);
        }
        .setup-step {
            background: #f8fafc;
            border-left: 4px solid #4f46e5;
            padding: 20px;
            margin: 15px 0;
            border-radius: 8px;
        }
        .step-number {
            background: #4f46e5;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
        }
        .code {
            background: #1e293b;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
        }
        .warning {
            background: #fef3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 Ultimate Web Assistant</h1>
        <p style="text-align: center; font-size: 1.2em; color: #64748b; margin-bottom: 40px;">
            Your AI-powered browsing companion!
        </p>
        
        <div class="warning">
            <strong>⚠️ API Key Required:</strong> 
            Create <code>config_local.py</code> with your Perplexity API key to enable AI features.
        </div>
        
        <div class="feature-grid">
            <div class="feature-card">
                <h3>💬 AI Chat</h3>
                <p>Chat with AI on any website</p>
            </div>
            <div class="feature-card">
                <h3>🔍 Analysis</h3>
                <p>Analyze any webpage instantly</p>
            </div>
            <div class="feature-card">
                <h3>📊 Summarize</h3>
                <p>Extract and summarize content</p>
            </div>
            <div class="feature-card">
                <h3>📚 Research</h3>
                <p>Research any topic</p>
            </div>
        </div>

        <div style="margin-top: 40px;">
            <h2>🚀 Setup Instructions</h2>
            
            <div class="setup-step">
                <span class="step-number">1</span>
                <strong>Open Chrome and go to</strong>
                <div class="code">chrome://extensions/</div>
            </div>
            
            <div class="setup-step">
                <span class="step-number">2</span>
                <strong>Enable "Developer mode" (top right)</strong>
            </div>
            
            <div class="setup-step">
                <span class="step-number">3</span>
                <strong>Click "Load unpacked"</strong>
            </div>
            
            <div class="setup-step">
                <span class="step-number">4</span>
                <strong>Select the</strong>
                <div class="code">chrome_extension</div>
                <strong>folder</strong>
            </div>
            
            <div class="setup-step">
                <span class="step-number">5</span>
                <strong>Visit any website and click the floating 🌟 button!</strong>
            </div>
        </div>

        <div style="text-align: center; margin-top: 40px; padding: 20px; background: #f1f5f9; border-radius: 12px;">
            <h3 style="color: #059669;">✅ Server Running Successfully!</h3>
            <p>• 💬 Chat with AI on any website</p>
            <p>• 🔍 Analyze any webpage instantly</p>
            <p>• 📊 Extract and summarize content</p>
            <p>• 📚 Research any topic</p>
            <p>• 📸 Take screenshots</p>
            <p>• 💾 Export all your data</p>
            <p style="margin-top: 20px; font-weight: bold; color: #4f46e5;">
                <strong>No restrictions • Perfect for learning!</strong>
            </p>
        </div>
    </div>
</body>
</html>
"""

@app.route('/api/analyze', methods=['POST'])
def analyze_page():
    """Analyze webpage content using Perplexity AI"""
    try:
        if Config.PERPLEXITY_API_KEY == 'your-api-key-here':
            return jsonify({
                'success': False,
                'error': 'Please configure your Perplexity API key in config_local.py'
            })
            
        data = request.get_json()
        page_content = data.get('content', '')
        page_url = data.get('url', '')
        
        # Prepare prompt for Perplexity
        prompt = f"""
Analyze this webpage content and provide insights:

URL: {page_url}
Content: {page_content[:3000]}...

Please provide:
1. Main topic and purpose
2. Key information and highlights
3. Content quality assessment
4. Recommendations for the user
"""
        
        # Call Perplexity API
        response = requests.post(
            'https://api.perplexity.ai/chat/completions',
            headers={
                'Authorization': f'Bearer {Config.PERPLEXITY_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': Config.PERPLEXITY_MODEL,
                'messages': [
                    {'role': 'system', 'content': 'You are a helpful web content analyzer. Provide clear, concise analysis.'},
                    {'role': 'user', 'content': prompt}
                ],
                'max_tokens': Config.MAX_TOKENS,
                'temperature': Config.TEMPERATURE
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            return jsonify({
                'success': True,
                'analysis': result['choices'][0]['message']['content']
            })
        else:
            return jsonify({
                'success': False,
                'error': f'API Error: {response.status_code}'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/api/research', methods=['POST'])
def research_topic():
    """Research a topic using Perplexity AI"""
    try:
        if Config.PERPLEXITY_API_KEY == 'your-api-key-here':
            return jsonify({
                'success': False,
                'error': 'Please configure your Perplexity API key in config_local.py'
            })
            
        data = request.get_json()
        topic = data.get('topic', '')
        context = data.get('context', '')
        
        # Prepare research prompt
        prompt = f"""
Research this topic: {topic}

Context: {context}

Please provide:
1. Comprehensive overview
2. Key facts and statistics
3. Recent developments
4. Reliable sources and references
5. Practical applications or implications
"""
        
        # Call Perplexity API
        response = requests.post(
            'https://api.perplexity.ai/chat/completions',
            headers={
                'Authorization': f'Bearer {Config.PERPLEXITY_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': Config.PERPLEXITY_MODEL,
                'messages': [
                    {'role': 'system', 'content': 'You are a helpful research assistant. Provide comprehensive, accurate information with citations when possible.'},
                    {'role': 'user', 'content': prompt}
                ],
                'max_tokens': Config.MAX_TOKENS,
                'temperature': Config.TEMPERATURE
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            return jsonify({
                'success': True,
                'research': result['choices'][0]['message']['content']
            })
        else:
            return jsonify({
                'success': False,
                'error': f'API Error: {response.status_code}'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/api/test')
def test_api():
    """Test API connection"""
    try:
        if Config.PERPLEXITY_API_KEY == 'your-api-key-here':
            return jsonify({
                'success': False,
                'error': 'Please configure your Perplexity API key in config_local.py'
            })
            
        # Simple test call to Perplexity
        response = requests.post(
            'https://api.perplexity.ai/chat/completions',
            headers={
                'Authorization': f'Bearer {Config.PERPLEXITY_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': Config.PERPLEXITY_MODEL,
                'messages': [
                    {'role': 'user', 'content': 'Hello, are you working?'}
                ],
                'max_tokens': 100
            }
        )
        
        if response.status_code == 200:
            return jsonify({
                'success': True,
                'message': 'API connection successful!',
                'timestamp': datetime.now().isoformat()
            })
        else:
            return jsonify({
                'success': False,
                'error': f'API Error: {response.status_code}'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/api/status')
def status():
    """Get server status"""
    return jsonify({
        'status': 'running',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'features': Config.FEATURES,
        'api_configured': Config.PERPLEXITY_API_KEY != 'your-api-key-here'
    })

if __name__ == '__main__':
    print("🌟 Ultimate Web Assistant Server Starting...")
    print("🔥 Dashboard: http://localhost:5000")
    if Config.PERPLEXITY_API_KEY == 'your-api-key-here':
        print("⚠️  Please configure your API key in config_local.py")
    else:
        print("✅ API configured and ready!")
    print("✅ Ready to serve your AI assistant!")
    app.run(host=Config.SERVER_HOST, port=Config.SERVER_PORT, debug=Config.DEBUG_MODE)