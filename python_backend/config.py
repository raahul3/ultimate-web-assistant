"""
⚙️ Configuration file for Ultimate Web Assistant

Instructions:
1. Copy this file to config_local.py
2. Add your Perplexity API key in config_local.py
3. The server will automatically use your local config
"""

import os

# Default configuration
class Config:
    # API Configuration
    PERPLEXITY_API_KEY = os.getenv('PERPLEXITY_API_KEY', 'your-api-key-here')
    PERPLEXITY_MODEL = 'sonar-pro-online'
    
    # Server Configuration
    SERVER_HOST = '0.0.0.0'
    SERVER_PORT = 5000
    DEBUG_MODE = True
    
    # API Settings
    MAX_TOKENS = 1500
    TEMPERATURE = 0.7
    
    # Features
    FEATURES = [
        'AI Analysis',
        'Research Assistant', 
        'Content Extraction',
        'Data Export',
        'Screenshot Capture'
    ]

# Try to load local configuration
try:
    from config_local import LocalConfig
    # Merge local config with defaults
    for attr in dir(LocalConfig):
        if not attr.startswith('_'):
            setattr(Config, attr, getattr(LocalConfig, attr))
except ImportError:
    print("⚠️  No local config found. Please create config_local.py with your API key.")
    pass