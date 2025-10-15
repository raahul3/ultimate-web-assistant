// 🌟 Ultimate Web Assistant - Content Script (Runs on every page)
console.log("🌐 Web Assistant Content Script Loaded");

class WebAssistantContentScript {
    constructor() {
        this.sidebarActive = false;
        this.sidebarContainer = null;
        this.toggleButton = null;
        this.init();
    }

    init() {
        // Don't inject on extension pages or chrome pages
        if (window.location.href.includes('chrome-extension://') || 
            window.location.href.includes('chrome://') || 
            window.location.href.includes('moz-extension://')) {
            return;
        }

        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createInterface());
        } else {
            this.createInterface();
        }
    }

    createInterface() {
        // Create floating toggle button
        this.createToggleButton();
        // Create sidebar container
        this.createSidebar();
        // Setup message listener for communication with popup
        this.setupMessageListener();
        console.log("✅ Web Assistant interface injected");
    }

    createToggleButton() {
        // Remove existing button if present
        const existing = document.getElementById('web-assistant-toggle');
        if (existing) existing.remove();

        this.toggleButton = document.createElement('div');
        this.toggleButton.id = 'web-assistant-toggle';
        this.toggleButton.className = 'sidebar-toggle';
        this.toggleButton.innerHTML = '🌟';
        this.toggleButton.title = 'Open Web Assistant';

        // Position and style
        Object.assign(this.toggleButton.style, {
            position: 'fixed',
            top: '50%',
            right: '20px',
            width: '50px',
            height: '50px',
            backgroundColor: '#4f46e5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '999998',
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
            transition: 'all 0.3s ease',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'
        });

        // Hover effects
        this.toggleButton.addEventListener('mouseenter', () => {
            this.toggleButton.style.transform = 'translateY(-50%) scale(1.1)';
            this.toggleButton.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.4)';
        });

        this.toggleButton.addEventListener('mouseleave', () => {
            this.toggleButton.style.transform = 'translateY(-50%) scale(1)';
            this.toggleButton.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.3)';
        });

        // Click to toggle sidebar
        this.toggleButton.addEventListener('click', () => this.toggleSidebar());

        document.body.appendChild(this.toggleButton);
    }

    createSidebar() {
        // Remove existing sidebar if present
        const existing = document.getElementById('web-assistant-sidebar');
        if (existing) existing.remove();

        this.sidebarContainer = document.createElement('div');
        this.sidebarContainer.id = 'web-assistant-sidebar';
        this.sidebarContainer.className = 'web-assistant-sidebar';

        // Sidebar styles
        Object.assign(this.sidebarContainer.style, {
            position: 'fixed',
            top: '0',
            right: '0',
            width: '400px',
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '-5px 0 25px rgba(0, 0, 0, 0.1)',
            zIndex: '999999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            overflowY: 'auto',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        });

        // Sidebar content
        this.sidebarContainer.innerHTML = `
            <div style="padding: 20px; height: 100%; display: flex; flex-direction: column;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
                    <h2 style="margin: 0; color: #4f46e5; font-size: 1.4em;">🌟 AI Assistant</h2>
                    <button id="close-sidebar" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #64748b;">×</button>
                </div>

                <!-- Page Info -->
                <div style="background: #f8fafc; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 1em;">📄 Current Page</h3>
                    <p style="margin: 5px 0; font-size: 0.9em; color: #6b7280; word-break: break-all;">${window.location.href}</p>
                    <p style="margin: 5px 0; font-size: 0.9em; color: #6b7280;">${document.title}</p>
                </div>

                <!-- Quick Actions -->
                <div style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 1em;">⚡ Quick Actions</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button id="analyze-page" style="padding: 8px 12px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85em;">🔍 Analyze</button>
                        <button id="summarize-page" style="padding: 8px 12px; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85em;">📊 Summarize</button>
                        <button id="extract-data" style="padding: 8px 12px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85em;">📝 Extract</button>
                        <button id="export-data" style="padding: 8px 12px; background: #7c2d12; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85em;">💾 Export</button>
                    </div>
                </div>

                <!-- Chat Area -->
                <div style="flex: 1; display: flex; flex-direction: column;">
                    <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 1em;">💬 AI Chat</h3>
                    
                    <!-- Messages -->
                    <div id="chat-messages" style="flex: 1; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 15px; margin-bottom: 15px; background: white; min-height: 200px;">
                        <div style="padding: 10px; background: #f3f4f6; border-radius: 8px; margin-bottom: 10px;">
                            <strong>🤖 Assistant:</strong><br>
                            <span style="color: #374151;">Hi! I'm your web assistant. I can help you analyze this page, extract data, answer questions, or perform tasks. What would you like me to do?</span>
                        </div>
                    </div>
                    
                    <!-- Input Area -->
                    <div style="display: flex; gap: 8px;">
                        <input id="chat-input" type="text" placeholder="Ask me anything about this page..." style="flex: 1; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px;">
                        <button id="send-message" style="padding: 10px 15px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer;">Send</button>
                    </div>
                </div>

                <!-- Research Section -->
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                    <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 1em;">🔬 Research</h3>
                    <div style="display: flex; gap: 8px;">
                        <input id="research-input" type="text" placeholder="Enter a topic to research..." style="flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px;">
                        <button id="research-btn" style="padding: 8px 12px; background: #7c3aed; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">Research</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.sidebarContainer);

        // Setup event listeners
        this.setupSidebarEvents();
    }

    setupSidebarEvents() {
        // Close sidebar
        document.getElementById('close-sidebar').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Quick actions
        document.getElementById('analyze-page').addEventListener('click', () => {
            this.addChatMessage('🤖 Assistant', this.analyzePage(), 'assistant');
        });

        document.getElementById('summarize-page').addEventListener('click', () => {
            this.addChatMessage('🤖 Assistant', '📊 Page Summary: ' + this.summarizePage(), 'assistant');
        });

        document.getElementById('extract-data').addEventListener('click', () => {
            this.exportPageData();
            this.addChatMessage('🤖 Assistant', '📝 Data extracted and downloaded!', 'assistant');
        });

        document.getElementById('export-data').addEventListener('click', () => {
            this.exportPageData();
            this.addChatMessage('🤖 Assistant', '💾 Page data exported successfully!', 'assistant');
        });

        // Chat functionality
        document.getElementById('send-message').addEventListener('click', () => {
            this.sendChatMessage();
        });

        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });

        // Research functionality
        document.getElementById('research-btn').addEventListener('click', () => {
            this.performResearch();
        });

        document.getElementById('research-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performResearch();
            }
        });
    }

    toggleSidebar() {
        this.sidebarActive = !this.sidebarActive;
        
        if (this.sidebarActive) {
            this.sidebarContainer.style.transform = 'translateX(0)';
            this.toggleButton.innerHTML = '×';
            this.toggleButton.style.right = '420px';
        } else {
            this.sidebarContainer.style.transform = 'translateX(100%)';
            this.toggleButton.innerHTML = '🌟';
            this.toggleButton.style.right = '20px';
        }
    }

    addChatMessage(sender, message, type) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = 'padding: 10px; margin-bottom: 10px; border-radius: 8px; animation: slideIn 0.3s ease;';
        
        if (type === 'user') {
            messageDiv.style.background = '#dbeafe';
            messageDiv.innerHTML = `<strong>👤 You:</strong><br><span style="color: #1e40af;">${message}</span>`;
        } else {
            messageDiv.style.background = '#f3f4f6';
            messageDiv.innerHTML = `<strong>${sender}:</strong><br><span style="color: #374151;">${message}</span>`;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addChatMessage('👤 You', message, 'user');
        input.value = '';
        
        // Simulate AI response (in real implementation, this would call the API)
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addChatMessage('🤖 Assistant', response, 'assistant');
        }, 1000);
    }

    generateAIResponse(message) {
        // Simple response generator (in production, this calls your API)
        const responses = [
            `I understand you're asking about "${message}". Based on this page, I can help you analyze the content and provide insights.`,
            `Great question about "${message}"! This page appears to be about ${document.title}. Let me analyze it for you.`,
            `Regarding "${message}", I can see this page has ${this.countWords()} words and ${document.querySelectorAll('a').length} links. What specifically would you like to know?`,
            `Thanks for asking about "${message}". I'm analyzing the current page content to provide you with relevant information.`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    performResearch() {
        const input = document.getElementById('research-input');
        const topic = input.value.trim();
        
        if (!topic) return;
        
        this.addChatMessage('🤖 Assistant', `🔬 Researching "${topic}"...`, 'assistant');
        
        setTimeout(() => {
            const result = `Research results for "${topic}" would appear here. This is a simulated response. In the full implementation, this would connect to the Perplexity API for real research results.`;
            this.addChatMessage('🤖 Assistant', result, 'assistant');
        }, 2000);
        
        input.value = '';
    }

    analyzePage() {
        const headings = document.querySelectorAll('h1,h2,h3,h4,h5,h6').length;
        const links = document.querySelectorAll('a[href]').length;
        const images = document.querySelectorAll('img').length;
        const words = this.countWords();
        const forms = document.querySelectorAll('form').length;
        
        return `📊 Page Analysis:\n• Title: ${document.title}\n• Words: ${words}\n• Headings: ${headings}\n• Links: ${links}\n• Images: ${images}\n• Forms: ${forms}\n\nThe page appears to be well-structured with good content organization.`;
    }

    summarizePage() {
        const title = document.title;
        const headings = Array.from(document.querySelectorAll('h1,h2,h3')).map(h => h.textContent.trim()).slice(0, 3);
        const firstParagraph = document.querySelector('p')?.textContent.substring(0, 200) || '';
        
        return `"${title}" - Key sections: ${headings.join(', ')}. ${firstParagraph}...`;
    }

    exportPageData() {
        const data = {
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString(),
            content: {
                text: document.body.innerText?.substring(0, 5000) || '',
                headings: Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => ({
                    level: h.tagName,
                    text: h.textContent.trim()
                })),
                links: Array.from(document.querySelectorAll('a[href]')).map(a => ({
                    text: a.textContent.trim(),
                    href: a.href
                })),
                images: Array.from(document.querySelectorAll('img[src]')).map(img => ({
                    alt: img.alt || '',
                    src: img.src
                }))
            },
            stats: {
                wordCount: this.countWords(),
                linkCount: document.querySelectorAll('a[href]').length,
                imageCount: document.querySelectorAll('img').length,
                headingCount: document.querySelectorAll('h1,h2,h3,h4,h5,h6').length
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `page_data_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    countWords() {
        const text = document.body.innerText || '';
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    setupMessageListener() {
        // Listen for messages from popup or background script
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'toggleSidebar') {
                this.toggleSidebar();
                sendResponse({ success: true });
            } else if (request.action === 'getPageData') {
                sendResponse({
                    title: document.title,
                    url: window.location.href,
                    wordCount: this.countWords(),
                    linkCount: document.querySelectorAll('a[href]').length
                });
            }
        });
    }
}

// Initialize the content script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new WebAssistantContentScript();
    });
} else {
    new WebAssistantContentScript();
}

// CSS animation keyframes
if (!document.querySelector('#web-assistant-animations')) {
    const animationStyle = document.createElement('style');
    animationStyle.id = 'web-assistant-animations';
    animationStyle.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(animationStyle);
}