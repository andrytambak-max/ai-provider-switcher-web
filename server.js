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
    note: 'Local local model'
  }
};

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ai-provider-switcher-web', providers: Object.keys(PROVIDERS) });
});

app.get('/api/providers', (_req, res) => {
  res.json({ providers: PROVIDERS });
});

function getModel(providerId, customModel) {
  return customModel && customModel.trim() ? customModel.trim() : PROVIDERS[providerId]?.model || 'gpt-4o-mini';
}

async function requestGemini({ apiKey, model, prompt, temperature, maxTokens }) {
  const url = `${PROVIDERS.gemini.endpoint}/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Gemini request failed');
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();

  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  return text;
}

async function requestClaude({ apiKey, model, prompt, temperature, maxTokens }) {
  const response = await fetch(PROVIDERS.claude.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Claude request failed');
  }

  const text = data?.content?.[0]?.text?.trim();
  if (!text) {
    throw new Error('Empty response from Claude');
  }

  return text;
}

async function requestOpenAiStyle({ providerId, apiKey, model, prompt, temperature, maxTokens }) {
  const endpoint = PROVIDERS[providerId].endpoint;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || `${PROVIDERS[providerId].name} request failed`);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error(`Empty response from ${PROVIDERS[providerId].name}`);
  }

  return typeof text === 'string' ? text : text.join('');
}

async function requestOllama({ apiKey, model, prompt, temperature, maxTokens }) {
  const response = await fetch(PROVIDERS.local.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: {
        temperature,
        num_predict: maxTokens
      }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Ollama request failed');
  }

  const text = data?.response?.trim();
  if (!text) {
    throw new Error('Empty response from Ollama');
  }

  return text;
}

async function generateText({ providerId, apiKey, model, message, temperature, maxTokens }) {
  const safeModel = getModel(providerId, model);

  if (providerId === 'gemini') {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    return requestGemini({ apiKey, model: safeModel, prompt: message, temperature, maxTokens });
  }

  if (providerId === 'claude') {
    if (!apiKey) {
      throw new Error('Claude API key is required');
    }
    return requestClaude({ apiKey, model: safeModel, prompt: message, temperature, maxTokens });
  }

  if (providerId === 'gpt' || providerId === 'deepseek' || providerId === 'grok') {
    if (!apiKey) {
      throw new Error(`${PROVIDERS[providerId].name} API key is required`);
    }
    return requestOpenAiStyle({ providerId, apiKey, model: safeModel, prompt: message, temperature, maxTokens });
  }

  if (providerId === 'local') {
    return requestOllama({ apiKey: apiKey || '', model: safeModel, prompt: message, temperature, maxTokens });
  }

  throw new Error('Unsupported provider');
}

async function runProviderCheck({ providerId, apiKey, model }) {
  const testPrompt = 'Reply with OK only.';
  const result = await generateText({
    providerId,
    apiKey,
    model,
    message: testPrompt,
    temperature: 0.2,
    maxTokens: 8
  });

  return {
    ok: true,
    provider: providerId,
    answer: result
  };
}

app.post('/api/chat', async (req, res) => {
  try {
    const { providerId, apiKey = '', model = '', message = '', temperature = 0.7, maxTokens = 512 } = req.body || {};

    if (!providerId) {
      return res.status(400).json({ error: 'providerId is required' });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }

    const text = await generateText({
      providerId,
      apiKey,
      model,
      message: message.trim(),
      temperature,
      maxTokens
    });

    res.json({ ok: true, answer: text, provider: providerId });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || 'Chat request failed' });
  }
});

app.post('/api/test-provider', async (req, res) => {
  try {
    const { providerId, apiKey = '', model = '' } = req.body || {};

    if (!providerId) {
      return res.status(400).json({ error: 'providerId is required' });
    }

    const result = await runProviderCheck({ providerId, apiKey, model });
    res.json(result);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || 'Provider test failed' });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Provider Switcher is running on http://localhost:${PORT}`);
});
