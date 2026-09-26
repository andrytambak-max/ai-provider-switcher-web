const PROVIDER_META = {
  gemini: { name: 'Gemini', icon: '🔵', model: 'gemini-2.0-flash' },
  claude: { name: 'Claude', icon: '🧠', model: 'claude-3-5-sonnet-20241022' },
  gpt: { name: 'GPT', icon: '🚀', model: 'gpt-4o-mini' },
  deepseek: { name: 'DeepSeek', icon: '🌊', model: 'deepseek-chat' },
  grok: { name: 'Grok', icon: '🐦', model: 'grok-beta' },
  local: { name: 'Ollama', icon: '🏠', model: 'llama3.1' }
};

const defaultState = {
  currentProvider: 'gemini',
  providers: {
    gemini: { apiKey: '', model: 'gemini-2.0-flash' },
    claude: { apiKey: '', model: 'claude-3-5-sonnet-20241022' },
    gpt: { apiKey: '', model: 'gpt-4o-mini' },
    deepseek: { apiKey: '', model: 'deepseek-chat' },
    grok: { apiKey: '', model: 'grok-beta' },
    local: { apiKey: '', model: 'llama3.1' }
  },
  history: []
};

const state = loadState();
const automationState = {
  intervalId: null,
  isRunning: false,
  intervalMs: 60000
};

const charts = {
  btc: null,
  gold: null
};

const providerGrid = document.getElementById('providerGrid');
const providerSelect = document.getElementById('providerSelect');
const providerApiKeyInput = document.getElementById('providerApiKey');
const providerModelInput = document.getElementById('providerModel');
const currentProviderName = document.getElementById('currentProviderName');
const currentProviderLabel = document.getElementById('currentProviderLabel');
const currentProviderModel = document.getElementById('currentProviderModel');
const currentModelText = document.getElementById('currentModelText');
const currentKeyState = document.getElementById('currentKeyState');
const currentProviderIcon = document.getElementById('currentProviderIcon');
const responseOutput = document.getElementById('responseOutput');
const historyList = document.getElementById('historyList');
const toast = document.getElementById('toast');
const statusBadge = document.getElementById('statusBadge');

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('ai-provider-switcher-state') || 'null');
    if (!saved) return structuredClone(defaultState);

    return {
      currentProvider: saved.currentProvider || defaultState.currentProvider,
      providers: { ...defaultState.providers, ...(saved.providers || {}) },
      history: Array.isArray(saved.history) ? saved.history : []
    };
  } catch (error) {
    console.error('Failed to load state:', error);
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem('ai-provider-switcher-state', JSON.stringify(state));
}

function showToast(message, type = 'info') {
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function renderProviderGrid() {
  providerGrid.innerHTML = '';

  Object.entries(PROVIDER_META).forEach(([providerId, meta]) => {
    const provider = document.createElement('button');
    provider.type = 'button';
    provider.className = `provider-item ${state.currentProvider === providerId ? 'active' : ''}`;
    provider.innerHTML = `
      <div class="provider-item-icon">${meta.icon}</div>
      <div class="provider-item-name">${meta.name}</div>
      <div class="provider-item-model">${state.providers[providerId]?.model || meta.model}</div>
    `;

    provider.addEventListener('click', () => {
      state.currentProvider = providerId;
      saveState();
      render();
      showToast(`${meta.name} selected`, 'success');
    });

    providerGrid.appendChild(provider);
  });
}

function renderProviderSelect() {
  providerSelect.innerHTML = '';

  Object.entries(PROVIDER_META).forEach(([providerId, meta]) => {
    const option = document.createElement('option');
    option.value = providerId;
    option.textContent = `${meta.icon} ${meta.name}`;
    if (state.currentProvider === providerId) option.selected = true;
    providerSelect.appendChild(option);
  });
}

function renderCurrentProvider() {
  const providerId = state.currentProvider;
  const provider = PROVIDER_META[providerId];
  const config = state.providers[providerId];

  currentProviderName.textContent = provider.name;
  currentProviderLabel.textContent = provider.name;
  currentProviderIcon.textContent = provider.icon;
  currentProviderModel.textContent = config.model || provider.model;
  currentModelText.textContent = config.model || provider.model;
  currentKeyState.textContent = config.apiKey ? 'Set' : 'Not set';

  providerApiKeyInput.value = config.apiKey || '';
  providerModelInput.value = config.model || provider.model;
}

function renderHistory() {
  historyList.innerHTML = '';

  if (!state.history.length) {
    historyList.innerHTML = '<li class="empty-history">No recent activity yet.</li>';
    return;
  }

  state.history.slice(0, 8).forEach((item) => {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `
      <span class="history-provider">${PROVIDER_META[item.provider]?.name || item.provider}</span>
      <span class="history-time">${new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      <span class="history-text">${item.prompt.slice(0, 80)}${item.prompt.length > 80 ? '...' : ''}</span>
    `;
    historyList.appendChild(li);
  });
}

function render() {
  renderProviderGrid();
  renderProviderSelect();
  renderCurrentProvider();
  renderHistory();
  statusBadge.textContent = 'Ready';
}

async function sendChatRequest(payload) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data;
}

async function testCurrentProvider() {
  const providerId = state.currentProvider;
  const config = state.providers[providerId];

  statusBadge.textContent = 'Testing...';

  try {
    const response = await fetch('/api/test-provider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId,
        apiKey: config.apiKey,
        model: config.model
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || 'Test failed');
    }

    responseOutput.textContent = `Connection successful: ${data.answer}`;
    showToast(`${PROVIDER_META[providerId].name} is reachable`, 'success');
    statusBadge.textContent = 'Connected';
  } catch (error) {
    responseOutput.textContent = `Test failed: ${error.message}`;
    showToast(error.message, 'error');
    statusBadge.textContent = 'Error';
  }
}

async function generateResponse() {
  const providerId = state.currentProvider;
  const config = state.providers[providerId];
  const prompt = document.getElementById('promptInput').value.trim();

  if (!prompt) {
    showToast('Please write a prompt first', 'warning');
    return;
  }

  statusBadge.textContent = 'Generating...';
  responseOutput.textContent = 'Generating response...';

  try {
    const result = await sendChatRequest({
      providerId,
      apiKey: config.apiKey,
      model: config.model,
      message: prompt,
      temperature: Number(document.getElementById('temperatureInput').value),
      maxTokens: Number(document.getElementById('maxTokensInput').value)
    });

    responseOutput.textContent = result.answer;
    state.history.unshift({
      provider: providerId,
      prompt,
      time: Date.now()
    });
    saveState();
    renderHistory();
    showToast('Response generated successfully', 'success');
    statusBadge.textContent = 'Ready';
  } catch (error) {
    responseOutput.textContent = `Error: ${error.message}`;
    showToast(error.message, 'error');
    statusBadge.textContent = 'Error';
  }
}

function handleProviderFormSubmit(event) {
  event.preventDefault();

  const providerId = providerSelect.value;
  const apiKey = providerApiKeyInput.value.trim();
  const model = providerModelInput.value.trim();

  state.providers[providerId] = {
    apiKey,
    model: model || PROVIDER_META[providerId].model
  };

  state.currentProvider = providerId;
  saveState();
  render();
  showToast(`${PROVIDER_META[providerId].name} settings saved`, 'success');
}

function clearPrompt() {
  document.getElementById('promptInput').value = '';
  responseOutput.textContent = 'No response yet.';
}

function buildSyntheticSeries(base, points, drift) {
  const result = [];
  let value = base;

  for (let i = 0; i < points; i += 1) {
    value += (Math.random() - 0.48) * drift;
    result.push(Number(value.toFixed(2)));
  }

  return result;
}

function createChart(canvasId, label, data, color) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: data.length }, (_, i) => i + 1),
      datasets: [{
        label,
        data,
        borderColor: color,
        backgroundColor: color + '22',
        borderWidth: 2,
        tension: 0.25,
        fill: true,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { display: false },
        y: {
          ticks: { color: '#cbd5e1' },
          grid: { color: 'rgba(148,163,184,0.12)' }
        }
      }
    }
  });
}

function initCharts() {
  const btcData = buildSyntheticSeries(62000, 60, 2200);
  const goldData = buildSyntheticSeries(2330, 60, 35);

  charts.btc = createChart('btcChart', 'BTC', btcData, '#60a5fa');
  charts.gold = createChart('goldChart', 'XAUUSD', goldData, '#fbbf24');
}

function refreshChartData() {
  if (!charts.btc) return;

  const btcLast = charts.btc.data.datasets[0].data.at(-1) || 62000;
  const nextBtc = btcLast + (Math.random() - 0.45) * 2200;
  charts.btc.data.datasets[0].data.push(Number(nextBtc.toFixed(2)));
  if (charts.btc.data.datasets[0].data.length > 90) {
    charts.btc.data.datasets[0].data.shift();
  }
  charts.btc.update();

  const goldLast = charts.gold.data.datasets[0].data.at(-1) || 2330;
  const nextGold = goldLast + (Math.random() - 0.45) * 35;
  charts.gold.data.datasets[0].data.push(Number(nextGold.toFixed(2)));
  if (charts.gold.data.datasets[0].data.length > 90) {
    charts.gold.data.datasets[0].data.shift();
  }
  charts.gold.update();
}

function captureChartImage(chart) {
  if (!chart) return null;
  return chart.canvas.toDataURL('image/png');
}

async function fetchEAModels() {
  try {
    const res = await fetch('/api/ea-models');
    const data = await res.json();
    return data.eaModels || {};
  } catch (error) {
    return {};
  }
}

async function populateEAModels() {
  const select = document.getElementById('eaModelSelect');
  if (!select) return;

  const models = await fetchEAModels();
  select.innerHTML = '';
  Object.entries(models).forEach(([key, model]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = `${model.name} v${model.version}`;
    select.appendChild(option);
  });
}

async function analyzeChartsWithAI() {
  const providerId = state.currentProvider;
  const config = state.providers[providerId];
  const asset = document.getElementById('automationAsset')?.value || 'BTC';
  const timeframe = document.getElementById('automationTimeframe')?.value || '1m';
  const eaModel = document.getElementById('eaModelSelect')?.value || 'scalping';

  if (!config.apiKey && providerId !== 'local') {
    showToast('Set API key before starting automation', 'warning');
    return;
  }

  const payload = {
    providerId,
    apiKey: config.apiKey,
    model: config.model,
    asset,
    timeframe,
    eaModel,
    prompt: `Analyze this chart image for ${asset} at ${timeframe}. Determine trend direction, support/resistance, likely entry/exit, stop loss, take profit, risk/reward, and the best EA model strategy to use. Format as concise trading notes.`,
    chartImages: [
      { name: 'BTC', data: captureChartImage(charts.btc) },
      { name: 'GOLD', data: captureChartImage(charts.gold) }
    ]
  };

  const resultBox = document.getElementById('automationResult');
  if (resultBox) {
    resultBox.textContent = 'Analyzing chart images...';
  }

  try {
    const response = await fetch('/api/vision-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Vision analysis failed');
    }

    if (resultBox) {
      resultBox.textContent = `${new Date().toLocaleTimeString()}\n\n${data.analysis || data.answer || 'No analysis returned.'}`;
    }
    showToast('Automation analysis updated', 'success');
  } catch (error) {
    if (resultBox) {
      resultBox.textContent = `Error: ${error.message}`;
    }
    showToast(error.message, 'error');
  }
}

function startAutoAnalysis() {
  if (automationState.isRunning) return;

  automationState.isRunning = true;
  document.getElementById('automationStatus').textContent = 'Running';

  analyzeChartsWithAI();
  automationState.intervalId = setInterval(() => {
    refreshChartData();
    analyzeChartsWithAI();
  }, automationState.intervalMs);
}

function stopAutoAnalysis() {
  automationState.isRunning = false;
  document.getElementById('automationStatus').textContent = 'Stopped';

  if (automationState.intervalId) {
    clearInterval(automationState.intervalId);
    automationState.intervalId = null;
  }
}

providerSelect.addEventListener('change', (event) => {
  state.currentProvider = event.target.value;
  saveState();
  render();
});

document.getElementById('providerForm').addEventListener('submit', handleProviderFormSubmit);
document.getElementById('generateBtn').addEventListener('click', generateResponse);
document.getElementById('clearBtn').addEventListener('click', clearPrompt);
document.getElementById('testProviderBtn').addEventListener('click', testCurrentProvider);
document.getElementById('temperatureInput').addEventListener('input', (event) => {
  document.getElementById('temperatureValue').textContent = Number(event.target.value).toFixed(1);
});
document.getElementById('startAutomationBtn').addEventListener('click', startAutoAnalysis);
document.getElementById('stopAutomationBtn').addEventListener('click', stopAutoAnalysis);

render();
initCharts();
populateEAModels();
