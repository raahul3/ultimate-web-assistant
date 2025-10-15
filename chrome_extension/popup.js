// 🌟 Ultimate Web Assistant - Main JavaScript
console.log("🚀 Web Assistant Loading...");

class WebAssistant {
    constructor() {
        this.apiKey = 'your-api-key-here'; // Will be configured in settings
        this.serverUrl = 'http://localhost:5000';
        this.currentTab = null;
        this.isAnalyzing = false;
        this.init();
    }

    async init() {
        console.log("🔧 Initializing Web Assistant...");
        
        // Get current tab info
        await this.getCurrentTab();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update page info
        await this.updatePageInfo();
        
        // Add welcome message
        this.addMessage("🤖 Assistant", "Hello! I'm your web assistant. I can analyze this page, answer questions, extract data, and help you with research. What would you like me to do?", "assistant");
        
        console.log("✅ Web Assistant Ready!");
    }

    async getCurrentTab() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            this.currentTab = tabs[0];
            return this.currentTab;
        } catch (error) {
            console.error("❌ Error getting current tab:", error);
        }
    }

    setupEventListeners() {
        // Chat functionality
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick actions
        document.getElementById('analyzePageBtn').addEventListener('click', () => this.analyzePage());
        document.getElementById('extractDataBtn').addEventListener('click', () => this.extractData());
        document.getElementById('takeScreenshotBtn').addEventListener('click', () => this.takeScreenshot());

        // Advanced tools
        document.getElementById('summarizeBtn').addEventListener('click', () => this.summarizePage());
        document.getElementById('translateBtn').addEventListener('click', () => this.translatePage());
        document.getElementById('searchBtn').addEventListener('click', () => this.searchInPage());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());

        // Research
        document.getElementById('researchBtn').addEventListener('click', () => this.researchTopic());
        document.getElementById('researchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.researchTopic();
            }
        });

        // Dashboard
        document.getElementById('openDashboardBtn').addEventListener('click', () => this.openDashboard());
    }

    async updatePageInfo() {
        if (!this.currentTab) return;

        document.getElementById('currentUrl').textContent = this.currentTab.url || 'Unknown';
        document.getElementById('currentTitle').textContent = this.currentTab.title || 'Unknown';

        // Get page stats
        try {
            const results = await chrome.scripting.executeScript({
                target: { tabId: this.currentTab.id },
                function: () => {
                    const text = document.body.innerText || '';
                    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
                    const links = document.querySelectorAll('a[href]').length;
                    return { words, links };
                }
            });

            if (results && results[0]) {
                const stats = results[0].result;
                document.getElementById('wordCount').textContent = stats.words.toLocaleString();
                document.getElementById('linkCount').textContent = stats.links.toLocaleString();
            }
        } catch (error) {
            console.error("❌ Error getting page stats:", error);
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage("👤 You", message, "user");
        input.value = '';
        
        // Show typing indicator
        const typingId = this.addMessage("🤖 Assistant", "🤔 Thinking...", "assistant");
        
        try {
            // Process message with AI
            const response = await this.processWithAI(message);
            
            // Remove typing indicator and add response
            this.removeMessage(typingId);
            this.addMessage("🤖 Assistant", response, "assistant");
        } catch (error) {
            this.removeMessage(typingId);
            this.addMessage("🤖 Assistant", "❌ Sorry, I encountered an error. Please make sure your API key is configured and the server is running.", "assistant");
            console.error("❌ Chat error:", error);
        }
    }

    async processWithAI(message) {
        // Get page content for context
        let pageContent = '';
        if (this.currentTab) {
            try {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: this.currentTab.id },
                    function: () => {
                        const title = document.title;
                        const url = window.location.href;
                        const text = document.body.innerText?.substring(0, 3000) || '';
                        const headings = Array.from(document.querySelectorAll('h1,h2,h3')).map(h => h.textContent).join('. ');
                        return { title, url, text, headings };
                    }
                });

                if (results && results[0]) {
                    const content = results[0].result;
                    pageContent = `Page: ${content.title}\nURL: ${content.url}\nHeadings: ${content.headings}\nContent: ${content.text}`;
                }
            } catch (error) {
                console.error("❌ Error getting page content:", error);
            }
        }

        // For demo purposes, return a simulated response
        // In production, this would call your Flask API
        return `I understand you're asking about "${message}". Based on the current page (${this.currentTab?.title || 'Unknown'}), I can help you analyze the content. To enable full AI capabilities, please configure your Perplexity API key and ensure the Flask server is running at localhost:5000.`;
    }

    addMessage(sender, content, type) {
        const chatMessages = document.getElementById('chatMessages');
        const messageId = 'msg_' + Date.now();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.id = messageId;
        
        const avatar = type === 'user' ? '👤' : '🤖';
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="avatar">${avatar}</span>
                <span class="sender">${sender}</span>
            </div>
            <div class="message-content">${content}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageId;
    }

    removeMessage(messageId) {
        const message = document.getElementById(messageId);
        if (message) {
            message.remove();
        }
    }

    async analyzePage() {
        this.updateStatus('Analyzing page...');
        
        try {
            const results = await chrome.scripting.executeScript({
                target: { tabId: this.currentTab.id },
                function: () => {
                    const headings = document.querySelectorAll('h1,h2,h3,h4,h5,h6').length;
                    const links = document.querySelectorAll('a[href]').length;
                    const images = document.querySelectorAll('img').length;
                    const forms = document.querySelectorAll('form').length;
                    const words = document.body.innerText?.trim().split(/\s+/).filter(w => w.length > 0).length || 0;
                    
                    return {
                        title: document.title,
                        url: window.location.href,
                        headings,
                        links,
                        images,
                        forms,
                        words
                    };
                }
            });

            if (results && results[0]) {
                const analysis = results[0].result;
                const message = `📊 **Page Analysis:**\n\n` +
                    `**Title:** ${analysis.title}\n` +
                    `**URL:** ${analysis.url}\n\n` +
                    `**Content Statistics:**\n` +
                    `• Words: ${analysis.words.toLocaleString()}\n` +
                    `• Headings: ${analysis.headings}\n` +
                    `• Links: ${analysis.links}\n` +
                    `• Images: ${analysis.images}\n` +
                    `• Forms: ${analysis.forms}\n\n` +
                    `This page appears to be well-structured with good content organization.`;
                
                this.addMessage("🤖 Assistant", message, "assistant");
            }
        } catch (error) {
            this.addMessage("🤖 Assistant", "❌ Analysis failed. Please try again.", "assistant");
            console.error("❌ Analysis error:", error);
        }
        
        this.updateStatus('Ready');
    }

    async extractData() {
        this.updateStatus('Extracting data...');
        
        try {
            await chrome.scripting.executeScript({
                target: { tabId: this.currentTab.id },
                function: () => {
                    const data = {
                        url: window.location.href,
                        title: document.title,
                        timestamp: new Date().toISOString(),
                        headings: Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => h.textContent.trim()),
                        links: Array.from(document.querySelectorAll('a[href]')).map(a => ({ text: a.textContent.trim(), href: a.href })),
                        images: Array.from(document.querySelectorAll('img[src]')).map(img => ({ alt: img.alt, src: img.src }))
                    };
                    
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `page_data_${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            });
            
            this.addMessage("🤖 Assistant", "📝 Data extracted and downloaded successfully!", "assistant");
        } catch (error) {
            this.addMessage("🤖 Assistant", "❌ Extraction failed. Please try again.", "assistant");
            console.error("❌ Extraction error:", error);
        }
        
        this.updateStatus('Ready');
    }

    async takeScreenshot() {
        this.updateStatus('Taking screenshot...');
        
        try {
            const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
            
            // Create download link
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `screenshot_${Date.now()}.png`;
            link.click();
            
            this.addMessage("🤖 Assistant", "📸 Screenshot captured and downloaded!", "assistant");
        } catch (error) {
            this.addMessage("🤖 Assistant", "❌ Screenshot failed. Please try again.", "assistant");
            console.error("❌ Screenshot error:", error);
        }
        
        this.updateStatus('Ready');
    }

    async summarizePage() {
        this.updateStatus('Summarizing...');
        
        try {
            const results = await chrome.scripting.executeScript({
                target: { tabId: this.currentTab.id },
                function: () => {
                    const title = document.title;
                    const headings = Array.from(document.querySelectorAll('h1,h2,h3')).map(h => h.textContent.trim()).slice(0, 5);
                    const firstPara = document.querySelector('p')?.textContent.substring(0, 200) || '';
                    return { title, headings, firstPara };
                }
            });

            if (results && results[0]) {
                const summary = results[0].result;
                const message = `📊 **Page Summary:**\n\n` +
                    `**Title:** ${summary.title}\n\n` +
                    `**Key Sections:**\n${summary.headings.map(h => `• ${h}`).join('\n')}\n\n` +
                    `**Overview:** ${summary.firstPara}...`;
                
                this.addMessage("🤖 Assistant", message, "assistant");
            }
        } catch (error) {
            this.addMessage("🤖 Assistant", "❌ Summarization failed. Please try again.", "assistant");
            console.error("❌ Summary error:", error);
        }
        
        this.updateStatus('Ready');
    }

    async researchTopic() {
        const input = document.getElementById('researchInput');
        const topic = input.value.trim();
        
        if (!topic) return;
        
        this.updateStatus('Researching...');
        this.addMessage("🤖 Assistant", `🔬 Researching "${topic}"...`, "assistant");
        
        try {
            // In production, this would call your Flask API
            setTimeout(() => {
                this.addMessage("🤖 Assistant", 
                    `📚 **Research Results for "${topic}":**\n\n` +
                    `This is a demo response. In the full implementation, this would connect to your Flask server at localhost:5000, which would then use the Perplexity API to provide comprehensive research results including:\n\n` +
                    `• Comprehensive overview\n` +
                    `• Key facts and statistics\n` +
                    `• Recent developments\n` +
                    `• Reliable sources and references\n` +
                    `• Practical applications\n\n` +
                    `To enable real research, configure your Perplexity API key and start the Flask server.`, 
                    "assistant"
                );
                this.updateStatus('Ready');
            }, 2000);
            
            input.value = '';
        } catch (error) {
            this.addMessage("🤖 Assistant", '❌ Research failed. Please try again.', "assistant");
            this.updateStatus('Ready');
        }
    }

    updateStatus(status) {
        document.getElementById('status').innerHTML = `🔄 ${status}`;
    }

    openDashboard() {
        chrome.tabs.create({ url: 'http://localhost:5000' });
    }

    // Additional utility methods
    async translatePage() {
        this.addMessage("🤖 Assistant", "🌍 Translation feature coming soon! For now, you can ask me to translate specific text in the chat.", "assistant");
    }

    async searchInPage() {
        const searchTerm = prompt("🔍 Enter search term:");
        if (searchTerm) {
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: this.currentTab.id },
                    function: (term) => {
                        window.find(term);
                    },
                    args: [searchTerm]
                });
                this.addMessage("🤖 Assistant", `🔍 Searched for "${searchTerm}" on the page.`, "assistant");
            } catch (error) {
                console.error("❌ Search error:", error);
            }
        }
    }

    async exportData() {
        try {
            const storage = await chrome.storage.local.get();
            const exportData = {
                timestamp: new Date().toISOString(),
                data: storage
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `web_assistant_export_${Date.now()}.json`;
            link.click();
            
            this.addMessage("🤖 Assistant", "💾 Data exported successfully!", "assistant");
        } catch (error) {
            console.error("❌ Export error:", error);
            this.addMessage("🤖 Assistant", "❌ Export failed. Please try again.", "assistant");
        }
    }
}

// Initialize the Web Assistant when popup loads
document.addEventListener('DOMContentLoaded', () => {
    new WebAssistant();
});

// Handle popup unload
window.addEventListener('beforeunload', () => {
    console.log("👋 Web Assistant popup closing...");
});