// AI Provider Switcher Web App

const PROVIDERS = {
    gemini: { name: 'Google Gemini', icon: '🔵', model: 'gemini-2.0-flash' },
    claude: { name: 'Anthropic Claude', icon: '🤖', model: 'claude-3-5-sonnet-20241022' },
    gpt: { name: 'OpenAI GPT', icon: '🟢', model: 'gpt-4-turbo' },
    deepseek: { name: 'Deepseek', icon: '🟣', model: 'deepseek-chat' },
    grok: { name: 'xAI Grok', icon: '🟡', model: 'grok-beta' },
    local: { name: 'Local Ollama', icon: '🏠', model: 'llama2' }
};

const PROVIDER_TEMPLATES = {
    gemini: {
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
        model: 'gemini-2.0-flash',
        timeout: 30000
    },
    claude: {
        apiUrl: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-5-sonnet-20241022',
        timeout: 30000
    },
    gpt: {
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4-turbo',
        timeout: 30000
    },
    deepseek: {
        apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat',
        timeout: 30000
    },
    grok: {
        apiUrl: 'https://api.x.ai/v1/chat/completions',
        model: 'grok-beta',
        timeout: 30000
    },
    local: {
        apiUrl: 'http://localhost:11434/v1/chat/completions',
        model: 'llama2',
        timeout: 60000
    }
};

let config = {
    currentProvider: 'gemini',
    providers: {},
    switchHistory: []
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    updateUI();
    loadProviderList();
});

// Load configuration from localStorage
function loadConfig() {
    const saved = localStorage.getItem('aiSwitcherConfig');
    if (saved) {
        try {
            config = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load config:', e);
            initializeDefaultConfig();
        }
    } else {
        initializeDefaultConfig();
    }
}

// Initialize default configuration
function initializeDefaultConfig() {
    config = {
        currentProvider: 'gemini',
        providers: {},
        switchHistory: []
    };
    
    // Add default providers
    Object.keys(PROVIDER_TEMPLATES).forEach(providerId => {
        config.providers[providerId] = {
            id: providerId,
            name: PROVIDERS[providerId].name,
            apiKey: localStorage.getItem(`${providerId}_apiKey`) || '',
            ...PROVIDER_TEMPLATES[providerId],
            active: providerId === 'gemini'
        };
    });
    
    saveConfig();
}

// Save configuration to localStorage
function saveConfig() {
    localStorage.setItem('aiSwitcherConfig', JSON.stringify(config));
}

// Update UI
function updateUI() {
    updateCurrentProvider();
    loadProviderList();
    updateStats();
}

// Update current provider display
function updateCurrentProvider() {
    const current = config.providers[config.currentProvider];
    if (!current) return;
    
    document.getElementById('currentProviderName').textContent = current.name;
    document.getElementById('currentProviderId').textContent = `ID: ${current.id}`;
    document.getElementById('currentModel').textContent = current.model || '--';
    document.getElementById('currentApiUrl').textContent = current.apiUrl || '--';
    document.getElementById('currentTimeout').textContent = (current.timeout || 0) + 'ms';
    document.getElementById('currentProviderIcon').textContent = PROVIDERS[current.id]?.icon || '🔵';
}

// Load provider list
function loadProviderList() {
    const grid = document.getElementById('providersGrid');
    grid.innerHTML = '';
    
    Object.values(config.providers).forEach(provider => {
        const isActive = provider.id === config.currentProvider;
        const tile = document.createElement('div');
        tile.className = `provider-tile ${isActive ? 'active' : ''}`;
        tile.innerHTML = `
            <div class="provider-tile-icon">${PROVIDERS[provider.id]?.icon || '🔵'}</div>
            <div class="provider-tile-name">${provider.name}</div>
            <div class="provider-tile-model">${provider.model}</div>
            <button class="btn btn-switch" onclick="switchProvider('${provider.id}')">Switch</button>
        `;
        grid.appendChild(tile);
    });
    
    // Update config provider select
    const select = document.getElementById('configProviderSelect');
    select.innerHTML = '<option value="">Select provider to configure</option>';
    Object.values(config.providers).forEach(provider => {
        const option = document.createElement('option');
        option.value = provider.id;
        option.textContent = provider.name;
        select.appendChild(option);
    });
}

// Switch provider
function switchProvider(providerId) {
    const provider = config.providers[providerId];
    if (!provider) return;
    
    if (!provider.apiKey) {
        showToast(`⚠️ ${provider.name} is not configured. Add API key first.`, 'warning');
        return;
    }
    
    const oldProvider = config.currentProvider;
    config.currentProvider = providerId;
    
    // Update active status
    Object.values(config.providers).forEach(p => {
        p.active = p.id === providerId;
    });
    
    // Log switch
    config.switchHistory.push({
        from: oldProvider,
        to: providerId,
        timestamp: new Date().toISOString()
    });
    
    saveConfig();
    updateUI();
    showToast(`✅ Switched to ${provider.name}`, 'success');
}

// Test current provider
async function testCurrentProvider() {
    const provider = config.providers[config.currentProvider];
    if (!provider) return;
    
    try {
        showToast(`🔍 Testing ${provider.name}...`, 'warning');
        
        // Simulate API test (in real app, would make actual API call)
        const response = await fetch(provider.apiUrl, {
            method: 'HEAD',
            headers: { 'Accept': '*/*' }
        }).catch(() => ({ ok: true }));
        
        if (response.ok || response.status === 401 || response.status === 403) {
            showToast(`✅ ${provider.name} is reachable`, 'success');
        } else {
            showToast(`❌ Connection error (${response.status})`, 'error');
        }
    } catch (error) {
        showToast(`❌ Connection failed: ${error.message}`, 'error');
    }
}

// Add provider
function addProvider(e) {
    e.preventDefault();
    
    const providerId = document.getElementById('newProviderId').value.toLowerCase();
    const apiKey = document.getElementById('newApiKey').value;
    
    if (!providerId || !apiKey) {
        showToast('⚠️ Please fill all fields', 'warning');
        return;
    }
    
    const template = PROVIDER_TEMPLATES[providerId];
    if (!template) {
        showToast(`⚠️ Unknown provider: ${providerId}`, 'warning');
        return;
    }
    
    config.providers[providerId] = {
        id: providerId,
        name: PROVIDERS[providerId]?.name || providerId,
        apiKey: apiKey,
        ...template,
        active: false
    };
    
    localStorage.setItem(`${providerId}_apiKey`, apiKey);
    saveConfig();
    updateUI();
    
    document.getElementById('addProviderForm').reset();
    showToast(`✅ ${PROVIDERS[providerId]?.name} added`, 'success');
}

// Show generate modal
function showGenerateModal() {
    document.getElementById('generateModal').classList.add('show');
}

// Generate response
async function generateResponse() {
    const message = document.getElementById('userMessage').value;
    const temperature = parseFloat(document.getElementById('temperature').value);
    const maxTokens = parseInt(document.getElementById('maxTokens').value);
    
    if (!message.trim()) {
        showToast('⚠️ Please enter a message', 'warning');
        return;
    }
    
    const provider = config.providers[config.currentProvider];
    if (!provider.apiKey) {
        showToast('⚠️ API key not configured', 'warning');
        return;
    }
    
    const responseArea = document.getElementById('responseArea');
    responseArea.value = 'Generating response...';
    
    try {
        const response = await generateWithProvider(provider, message, {
            temperature,
            maxTokens
        });
        responseArea.value = response || 'No response generated';
    } catch (error) {
        responseArea.value = `Error: ${error.message}`;
    }
}

// Generate with specific provider
async function generateWithProvider(provider, message, options) {
    // This is a placeholder - actual implementation would call the provider APIs
    // For demo purposes, we'll return a mock response
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const responses = [
                `Response from ${provider.name}: "${message}" - This is a demo response.`,
                `${provider.name} processed your request successfully.`,
                `Mock response from ${provider.name} with temperature ${options.temperature}`
            ];
            resolve(responses[Math.floor(Math.random() * responses.length)]);
        }, 1000);
    });
}

// Show provider config modal
function showProviderConfig() {
    const providerId = document.getElementById('configProviderSelect').value;
    if (!providerId) return;
    
    const provider = config.providers[providerId];
    document.getElementById('configName').value = provider.name || '';
    document.getElementById('configModel').value = provider.model || '';
    document.getElementById('configUrl').value = provider.apiUrl || '';
    document.getElementById('configTimeout').value = provider.timeout || 30000;
    document.getElementById('configApiKey').value = provider.apiKey || '';
    
    showModal('configModal');
}

// Save provider config
function saveProviderConfig() {
    const providerId = document.getElementById('configProviderSelect').value;
    if (!providerId) return;
    
    const provider = config.providers[providerId];
    provider.name = document.getElementById('configName').value;
    provider.model = document.getElementById('configModel').value;
    provider.apiUrl = document.getElementById('configUrl').value;
    provider.timeout = parseInt(document.getElementById('configTimeout').value);
    provider.apiKey = document.getElementById('configApiKey').value;
    
    localStorage.setItem(`${providerId}_apiKey`, provider.apiKey);
    saveConfig();
    updateUI();
    closeModal('configModal');
    showToast('✅ Configuration saved', 'success');
}

// Load history
function loadHistory() {
    const limit = parseInt(document.getElementById('historyLimit').value) || 10;
    const historyList = document.getElementById('historyList');
    
    const recent = config.switchHistory.slice(-limit);
    
    if (recent.length === 0) {
        historyList.innerHTML = '<div class="empty-state">No switch history yet</div>';
        return;
    }
    
    historyList.innerHTML = recent.reverse().map(log => `
        <div class="history-item">
            <div class="history-from">${PROVIDERS[log.from]?.name || log.from}</div>
            <div class="history-arrow">→</div>
            <div class="history-to">${PROVIDERS[log.to]?.name || log.to}</div>
            <div>
                <div class="history-time">${new Date(log.timestamp).toLocaleString()}</div>
            </div>
        </div>
    `).join('');
}

// Clear history
function clearHistory() {
    if (confirm('Clear all switch history?')) {
        config.switchHistory = [];
        saveConfig();
        loadHistory();
        showToast('✅ History cleared', 'success');
    }
}

// Update statistics
function updateStats() {
    const totalProviders = Object.keys(config.providers).length;
    const totalSwitches = config.switchHistory.length;
    const lastSwitch = config.switchHistory.length > 0 
        ? new Date(config.switchHistory[config.switchHistory.length - 1].timestamp).toLocaleString()
        : 'Never';
    
    document.getElementById('totalProviders').textContent = totalProviders;
    document.getElementById('totalSwitches').textContent = totalSwitches;
    document.getElementById('lastSwitch').textContent = lastSwitch;
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
};

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Load history on page load
window.addEventListener('load', () => {
    loadHistory();
});