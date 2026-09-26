const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const PROVIDERS = {
  gemini: {
    name: 'Gemini',
    model: 'gemini-2.0-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    needsApiKey: true,
    note: 'Google AI Studio'
  },
  claude: {
    name: 'Claude',
    model: 'claude-3-5-sonnet-20241022',
    endpoint: 'https://api.anthropic.com/v1/messages',
    needsApiKey: true,
    note: 'Anthropic'
  },
  gpt: {
    name: 'GPT',
    model: 'gpt-4o-mini',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    needsApiKey: true,
    note: 'OpenAI'
  },
  deepseek: {
    name: 'DeepSeek',
    model: 'deepseek-chat',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    needsApiKey: true,
    note: 'DeepSeek'
  },
  grok: {
    name: 'Grok',
    model: 'grok-beta',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    needsApiKey: true,
    note: 'xAI'
  },
  local: {
    name: 'Ollama',
    model: 'llama3.1',
    endpoint: 'http://localhost:11434/api/generate',
    needsApiKey: false,
    note: 'Local model'
  }
};

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

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ai-provider-switcher-web', providers: Object.keys(PROVIDERS) });
});

app.get('/api/providers', (_req, res) => {
  res.json({ providers: PROVIDERS });
});

app.get('/api/ea-models', (_req, res) => {
  res.json({ eaModels: EA_MODELS });
});

function getModel(providerId, customModel) {
  return customModel && customModel.trim() ? customModel.trim() : PROVIDERS[providerId]?.model || 'gpt-4o-mini';
}

async function requestGemini({ apiKey, model, prompt, temperature, maxTokens, imageData = null }) {
  const url = `${PROVIDERS.gemini.endpoint}/${model}:generateContent?key=${apiKey}`;
  const parts = [{ text: prompt }];

  if (imageData) {
    parts.push({ inline_data: { mime_type: 'image/png', data: imageData.replace(/^data:image\/png;base64,/, '') } });
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens
      }
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'Gemini request failed');

  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

async function requestClaude({ apiKey, model, prompt, temperature, maxTokens, imageData = null }) {
  const content = [{ type: 'text', text: prompt }];

  if (imageData) {
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/png',
        data: imageData.replace(/^data:image\/png;base64,/, '')
      }
    });
  }

  const response = await fetch(PROVIDERS.claude.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content }],
      max_tokens: maxTokens,
      temperature
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'Claude request failed');
  const text = data?.content?.[0]?.text?.trim();
  if (!text) throw new Error('Empty response from Claude');
  return text;
}

async function requestOpenAiStyle({ providerId, apiKey, model, prompt, temperature, maxTokens, imageData = null }) {
  const endpoint = PROVIDERS[providerId].endpoint;
  const content = [{ type: 'text', text: prompt }];

  if (imageData) {
    content.push({ type: 'image_url', image_url: { url: imageData } });
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content }],
      temperature,
      max_tokens: maxTokens
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || `${PROVIDERS[providerId].name} request failed`);

  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error(`Empty response from ${PROVIDERS[providerId].name}`);
  return typeof text === 'string' ? text : text.join('');
}

async function requestOllama({ model, prompt, temperature, maxTokens, imageData = null }) {
  const body = {
    model,
    prompt,
    stream: false,
    options: {
      temperature,
      num_predict: maxTokens
    }
  };

  if (imageData) {
    body.images = [imageData.replace(/^data:image\/png;base64,/, '')];
  }

  const response = await fetch(PROVIDERS.local.endpoint.replace('/api/generate', '/api/generate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || 'Ollama request failed');

  const text = data?.response?.trim();
  if (!text) throw new Error('Empty response from Ollama');
  return text;
}

async function generateText({ providerId, apiKey, model, message, temperature, maxTokens, imageData = null }) {
  const safeModel = getModel(providerId, model);

  if (providerId === 'gemini') {
    if (!apiKey) throw new Error('Gemini API key is required');
    return requestGemini({ apiKey, model: safeModel, prompt: message, temperature, maxTokens, imageData });
  }

  if (providerId === 'claude') {
    if (!apiKey) throw new Error('Claude API key is required');
    return requestClaude({ apiKey, model: safeModel, prompt: message, temperature, maxTokens, imageData });
  }

  if (providerId === 'gpt' || providerId === 'deepseek' || providerId === 'grok') {
    if (!apiKey) throw new Error(`${PROVIDERS[providerId].name} API key is required`);
    return requestOpenAiStyle({ providerId, apiKey, model: safeModel, prompt: message, temperature, maxTokens, imageData });
  }

  if (providerId === 'local') {
    return requestOllama({ model: safeModel, prompt: message, temperature, maxTokens, imageData });
  }

  throw new Error('Unsupported provider');
}

async function runProviderCheck({ providerId, apiKey, model }) {
  const result = await generateText({
    providerId,
    apiKey,
    model,
    message: 'Reply with OK only.',
    temperature: 0.2,
    maxTokens: 8
  });

  return { ok: true, provider: providerId, answer: result };
}

app.post('/api/chat', async (req, res) => {
  try {
    const { providerId, apiKey = '', model = '', message = '', temperature = 0.7, maxTokens = 512 } = req.body || {};

    if (!providerId) return res.status(400).json({ error: 'providerId is required' });
    if (!message || !message.trim()) return res.status(400).json({ error: 'message is required' });

    const text = await generateText({
      providerId,
      apiKey,
      model,
      message: message.trim(),
      temperature,
      maxTokens
    });

    res.json({ ok: true, answer: text, provider: providerId, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || 'Chat request failed' });
  }
});

app.post('/api/test-provider', async (req, res) => {
  try {
    const { providerId, apiKey = '', model = '' } = req.body || {};
    if (!providerId) return res.status(400).json({ error: 'providerId is required' });

    const result = await runProviderCheck({ providerId, apiKey, model });
    res.json(result);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || 'Provider test failed' });
  }
});

app.post('/api/market-analysis', async (req, res) => {
  try {
    const { providerId, apiKey = '', model = '', asset = 'BTC', timeframe = '1m', eaModel = '' } = req.body || {};

    if (!providerId || !asset) return res.status(400).json({ error: 'providerId and asset are required' });

    const marketPrompt = `Analyze ${asset} market on ${timeframe} timeframe for ${new Date().toISOString()}. Provide: 1. trend 2. support/resistance 3. entry/exit 4. risk/reward 5. EA suitability ${eaModel ? `6. suggested EA: ${eaModel}` : ''}. Keep it concise and actionable.`;

    const analysis = await generateText({
      providerId,
      apiKey,
      model,
      message: marketPrompt,
      temperature: 0.3,
      maxTokens: 512
    });

    res.json({ ok: true, asset, timeframe, analysis, timestamp: new Date().toISOString(), eaModel: eaModel || 'None' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || 'Market analysis failed' });
  }
});

app.post('/api/vision-analysis', async (req, res) => {
  try {
    const {
      providerId,
      apiKey = '',
      model = '',
      asset = 'BTC',
      timeframe = '1m',
      eaModel = 'scalping',
      prompt = '',
      chartImages = []
    } = req.body || {};

    if (!providerId) return res.status(400).json({ error: 'providerId is required' });
    if (!chartImages || !chartImages.length) return res.status(400).json({ error: 'chartImages are required' });

    const imagePayload = chartImages[0]?.data || null;
    const promptText = `${prompt || 'Analyze this trading chart and give a succinct trading recommendation.'} Asset: ${asset}. Timeframe: ${timeframe}. EA Model: ${eaModel}.`;

    const analysis = await generateText({
      providerId,
      apiKey,
      model,
      message: promptText,
      temperature: 0.3,
      maxTokens: 600,
      imageData: imagePayload
    });

    res.json({ ok: true, analysis, asset, timeframe, provider: providerId, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || 'Vision analysis failed' });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Provider Switcher is running on http://localhost:${PORT}`);
  console.log('AI vision analysis and 1-minute EA automation enabled');
});
