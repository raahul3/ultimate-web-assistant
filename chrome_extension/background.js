// 🌟 Ultimate Web Assistant - Background Script

console.log("🚀 Web Assistant Background Script Started");

class WebAssistantBackground {

    constructor() {
        this.init();
    }

    init() {
        // Setup extension installation handler
        chrome.runtime.onInstalled.addListener((details) => {
            this.handleInstallation(details);
        });

        // Setup context menu
        this.createContextMenus();

        // Setup message handling
        this.setupMessageHandling();

        // Setup tab update listener
        this.setupTabListener();

        console.log("✅ Background script initialized");
    }

    handleInstallation(details) {
        if (details.reason === 'install') {
            console.log("🎉 Web Assistant installed!");

            // Show welcome notification
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: '🌟 Web Assistant Installed!',
                message: 'Your AI-powered web assistant is ready! Click any webpage to start using it.'
            });

            // Open welcome page
            chrome.tabs.create({
                url: chrome.runtime.getURL('popup.html')
            });

        } else if (details.reason === 'update') {
            console.log("🔄 Web Assistant updated!");
            
            // Show update notification
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: '🌟 Web Assistant Updated!',
                message: 'New features and improvements are now available!'
            });
        }
    }

    createContextMenus() {
        // Remove existing menus
        chrome.contextMenus.removeAll(() => {
            // Create main menu
            chrome.contextMenus.create({
                id: 'webAssistantMain',
                title: '🌟 Web Assistant',
                contexts: ['all']
            });

            // Analyze page
            chrome.contextMenus.create({
                id: 'analyzePage',
                parentId: 'webAssistantMain',
                title: '🔍 Analyze This Page',
                contexts: ['page']
            });

            // Extract text
            chrome.contextMenus.create({
                id: 'extractText',
                parentId: 'webAssistantMain',
                title: '📝 Extract Selected Text',
                contexts: ['selection']
            });

            // Research selected
            chrome.contextMenus.create({
                id: 'researchSelected',
                parentId: 'webAssistantMain',
                title: '🔬 Research Selected Text',
                contexts: ['selection']
            });

            // Take screenshot
            chrome.contextMenus.create({
                id: 'takeScreenshot',
                parentId: 'webAssistantMain',
                title: '📸 Take Screenshot',
                contexts: ['page']
            });

            // Separator
            chrome.contextMenus.create({
                id: 'separator1',
                parentId: 'webAssistantMain',
                type: 'separator',
                contexts: ['all']
            });

            // Open dashboard
            chrome.contextMenus.create({
                id: 'openDashboard',
                parentId: 'webAssistantMain',
                title: '🌐 Open Dashboard',
                contexts: ['all']
            });

            console.log("📋 Context menus created");
        });
    }

    setupMessageHandling() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log("📨 Message received:", request);

            switch (request.action) {
                case 'getTabInfo':
                    this.handleGetTabInfo(sendResponse);
                    return true;

                case 'analyzeUrl':
                    this.handleAnalyzeUrl(request.url, sendResponse);
                    return true;

                case 'takeScreenshot':
                    this.handleTakeScreenshot(sendResponse);
                    return true;

                case 'openDashboard':
                    this.handleOpenDashboard();
                    sendResponse({ success: true });
                    return false;

                case 'storeData':
                    this.handleStoreData(request.data, sendResponse);
                    return true;

                case 'getData':
                    this.handleGetData(request.key, sendResponse);
                    return true;

                default:
                    console.warn("⚠️ Unknown message action:", request.action);
                    sendResponse({ success: false, error: 'Unknown action' });
                    return false;
            }
        });

        // Handle context menu clicks
        chrome.contextMenus.onClicked.addListener((info, tab) => {
            this.handleContextMenuClick(info, tab);
        });
    }

    setupTabListener() {
        // Listen for tab updates
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                console.log("🔄 Tab updated:", tab.url);
                // Could inject content script here if needed
            }
        });

        // Listen for tab activation
        chrome.tabs.onActivated.addListener((activeInfo) => {
            console.log("🎯 Tab activated:", activeInfo.tabId);
        });
    }

    async handleGetTabInfo(sendResponse) {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs.length > 0) {
                const tab = tabs[0];
                sendResponse({
                    success: true,
                    tabInfo: {
                        id: tab.id,
                        url: tab.url,
                        title: tab.title,
                        favIconUrl: tab.favIconUrl
                    }
                });
            } else {
                sendResponse({ success: false, error: 'No active tab found' });
            }
        } catch (error) {
            console.error("❌ Error getting tab info:", error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async handleAnalyzeUrl(url, sendResponse) {
        try {
            // This would integrate with your Flask API
            console.log("🔍 Analyzing URL:", url);
            
            // For demo purposes, return mock analysis
            const analysis = {
                url: url,
                timestamp: new Date().toISOString(),
                analysis: 'This is a demo analysis. In the full implementation, this would call your Flask server API.',
                score: Math.floor(Math.random() * 100)
            };

            sendResponse({ success: true, analysis });
        } catch (error) {
            console.error("❌ Error analyzing URL:", error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async handleTakeScreenshot(sendResponse) {
        try {
            const dataUrl = await chrome.tabs.captureVisibleTab(null, {
                format: 'png',
                quality: 90
            });

            // Store screenshot with timestamp
            const timestamp = new Date().toISOString();
            const screenshotData = {
                dataUrl: dataUrl,
                timestamp: timestamp,
                filename: `screenshot_${Date.now()}.png`
            };

            sendResponse({ success: true, screenshot: screenshotData });
        } catch (error) {
            console.error("❌ Error taking screenshot:", error);
            sendResponse({ success: false, error: error.message });
        }
    }

    handleOpenDashboard() {
        chrome.tabs.create({
            url: 'http://localhost:5000'
        });
    }

    async handleStoreData(data, sendResponse) {
        try {
            const key = data.key || `data_${Date.now()}`;
            await chrome.storage.local.set({ [key]: data.value });
            sendResponse({ success: true, key });
        } catch (error) {
            console.error("❌ Error storing data:", error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async handleGetData(key, sendResponse) {
        try {
            const result = await chrome.storage.local.get(key);
            sendResponse({ success: true, data: result[key] });
        } catch (error) {
            console.error("❌ Error getting data:", error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async handleContextMenuClick(info, tab) {
        console.log("📋 Context menu clicked:", info.menuItemId);

        switch (info.menuItemId) {
            case 'analyzePage':
                await this.injectAndAnalyzePage(tab);
                break;

            case 'extractText':
                await this.extractSelectedText(info, tab);
                break;

            case 'researchSelected':
                await this.researchSelectedText(info, tab);
                break;

            case 'takeScreenshot':
                await this.takeScreenshotFromMenu(tab);
                break;

            case 'openDashboard':
                this.handleOpenDashboard();
                break;

            default:
                console.warn("⚠️ Unknown context menu item:", info.menuItemId);
        }
    }

    async injectAndAnalyzePage(tab) {
        try {
            // Inject content script if needed
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                    // Trigger analysis in content script
                    const event = new CustomEvent('webAssistantAnalyze');
                    document.dispatchEvent(event);
                }
            });
        } catch (error) {
            console.error("❌ Error analyzing page:", error);
        }
    }

    async extractSelectedText(info, tab) {
        if (info.selectionText) {
            try {
                // Store selected text
                await chrome.storage.local.set({
                    [`extracted_${Date.now()}`]: {
                        text: info.selectionText,
                        url: tab.url,
                        timestamp: new Date().toISOString()
                    }
                });

                // Show notification
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: '📝 Text Extracted',
                    message: `Extracted ${info.selectionText.length} characters`
                });
            } catch (error) {
                console.error("❌ Error extracting text:", error);
            }
        }
    }

    async researchSelectedText(info, tab) {
        if (info.selectionText) {
            // Open research in new tab or popup
            const researchUrl = `http://localhost:5000/research?q=${encodeURIComponent(info.selectionText)}`;
            chrome.tabs.create({ url: researchUrl });
        }
    }

    async takeScreenshotFromMenu(tab) {
        try {
            const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
            
            // Create download link
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `screenshot_${Date.now()}.png`;
            
            // Inject script to download
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: (dataUrl) => {
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = `screenshot_${Date.now()}.png`;
                    link.click();
                },
                args: [dataUrl]
            });

            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: '📸 Screenshot Taken',
                message: 'Screenshot has been downloaded'
            });
        } catch (error) {
            console.error("❌ Error taking screenshot:", error);
        }
    }
}

// Initialize background script
const webAssistantBackground = new WebAssistantBackground();

// Keep service worker alive
setInterval(() => {
    console.log("💓 Service worker heartbeat");
}, 30000); // 30 seconds

console.log("✅ Web Assistant Background Script Ready!");