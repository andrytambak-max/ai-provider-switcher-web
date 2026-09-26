const EA_MODELS = {
  scalping: {
    name: 'Scalping EA',
    version: '2.5',
    description: 'Ultra-fast scalping strategy for 1-5 min timeframes',
    features: ['Real-time signals', 'Risk management', 'Volume analysis'],
    timeframes: ['1m', '5m'],
    assets: ['BTC', 'GOLD'],
    riskPerTrade: 1,
    takeProfit: 50,
    stopLoss: 20
  },
  daytrading: {
    name: 'Day Trading EA',
    version: '3.1',
    description: 'Daily trading strategy for 15m-1h charts',
    features: ['Support/Resistance', 'Trend detection', 'Entry signals'],
    timeframes: ['15m', '30m', '1h'],
    assets: ['BTC', 'GOLD'],
    riskPerTrade: 2,
    takeProfit: 100,
    stopLoss: 40
  },
  swingtrading: {
    name: 'Swing Trading EA',
    version: '2.8',
    description: 'Multi-day swing strategy for 4h-1D timeframes',
    features: ['Fibonacci levels', 'Moving averages', 'Pattern recognition'],
    timeframes: ['4h', '1D'],
    assets: ['BTC', 'GOLD'],
    riskPerTrade: 1.5,
    takeProfit: 200,
    stopLoss: 60
  },
  arbitrage: {
    name: 'Arbitrage EA',
    version: '2.2',
    description: 'Cross-exchange arbitrage opportunities',
    features: ['Price discrepancy detection', 'Instant execution', 'Low latency'],
    timeframes: ['1m'],
    assets: ['BTC', 'GOLD'],
    riskPerTrade: 0.5,
    takeProfit: 25,
    stopLoss: 10
  },
  gridtrading: {
    name: 'Grid Trading EA',
    version: '3.0',
    description: 'Grid-based trading in range-bound markets',
    features: ['Auto-grid placement', 'Profit accumulation', 'Dynamic levels'],
    timeframes: ['5m', '15m'],
    assets: ['BTC', 'GOLD'],
    riskPerTrade: 2.5,
    takeProfit: 150,
    stopLoss: 80
  },
  martingale: {
    name: 'Martingale EA',
    version: '2.6',
    description: 'Progressive lot size strategy with reversal detection',
    features: ['Lot progression', 'Reversal signals', 'Breakeven protection'],
    timeframes: ['30m', '1h'],
    assets: ['BTC', 'GOLD'],
    riskPerTrade: 3,
    takeProfit: 120,
    stopLoss: 100
  }
};

// Add automation and EA model support to existing app state
const automationState = {
  intervalId: null,
  isRunning: false,
  intervalMs: 60000
};

async function fetchEAModels() {
  const response = await fetch('/api/ea-models');
  const data = await response.json();
  return data.eaModels || {};
}

async function startAutoAnalysis() {
  const providerId = state.currentProvider;
  const config = state.providers[providerId];
  const asset = document.getElementById('automationAsset')?.value || 'BTC';
  const timeframe = document.getElementById('automationTimeframe')?.value || '1m';
  const eaModel = document.getElementById('eaModelSelect')?.value || 'scalping';

  if (!config.apiKey && providerId !== 'local') {
    showToast('Set API key before running automation', 'warning');
    return;
  }

  automationState.isRunning = true;
  updateAutomationStatus('Running');

  const runAnalysis = async () => {
    try {
      const response = await fetch('/api/market-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          apiKey: config.apiKey,
          model: config.model,
          asset,
          timeframe,
          eaModel
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Automation failed');
      }

      const resultBox = document.getElementById('automationResult');
      if (resultBox) {
        resultBox.textContent = `${new Date().toLocaleTimeString()}\n\n${data.analysis}`;
      }

      showToast(`Analysis updated for ${asset}`, 'success');
    } catch (error) {
      const resultBox = document.getElementById('automationResult');
      if (resultBox) {
        resultBox.textContent = `Error: ${error.message}`;
      }
      showToast(error.message, 'error');
    }
  };

  await runAnalysis();

  if (automationState.intervalId) {
    clearInterval(automationState.intervalId);
  }

  automationState.intervalId = setInterval(runAnalysis, automationState.intervalMs);
}

function stopAutoAnalysis() {
  automationState.isRunning = false;
  updateAutomationStatus('Stopped');

  if (automationState.intervalId) {
    clearInterval(automationState.intervalId);
    automationState.intervalId = null;
  }
}

function updateAutomationStatus(value) {
  const statusEl = document.getElementById('automationStatus');
  if (statusEl) {
    statusEl.textContent = value;
  }
}

async function populateEAModels() {
  try {
    const eaModels = await fetchEAModels();
    const select = document.getElementById('eaModelSelect');
    if (!select) return;

    select.innerHTML = '';

    Object.entries(eaModels).forEach(([key, model]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = `${model.name} v${model.version}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load EA models:', error);
  }
}

function bindAutomationControls() {
  const startBtn = document.getElementById('startAutomationBtn');
  const stopBtn = document.getElementById('stopAutomationBtn');

  if (startBtn) {
    startBtn.addEventListener('click', startAutoAnalysis);
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', stopAutoAnalysis);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  populateEAModels();
  bindAutomationControls();
});
