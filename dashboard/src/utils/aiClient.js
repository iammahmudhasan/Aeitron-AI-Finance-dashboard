/**
 * Model-agnostic AI client utility.
 *
 * Switch providers by changing VITE_ACTIVE_AI_PROVIDER in .env.
 * Supported: openai, anthropic, gemini, deepseek, local
 */

const PROVIDER_CONFIG = {
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o',
    buildHeaders: (apiKey) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }),
    buildBody: (model, systemPrompt, messages) => ({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
    parseResponse: (data) => data.choices?.[0]?.message?.content ?? '',
  },

  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-20250514',
    buildHeaders: (apiKey) => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    }),
    buildBody: (model, systemPrompt, messages) => ({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    }),
    parseResponse: (data) =>
      data.content?.map((b) => b.text).join('') ?? '',
  },

  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    model: 'gemini-2.0-flash',
    buildHeaders: () => ({ 'Content-Type': 'application/json' }),
    buildBody: (_model, systemPrompt, messages) => ({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    }),
    buildUrl: (baseUrl, model, apiKey) =>
      `${baseUrl ?? 'https://generativelanguage.googleapis.com/v1beta'}/models/${model}:generateContent?key=${apiKey}`,
    parseResponse: (data) =>
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? '',
  },

  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    buildHeaders: (apiKey) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }),
    buildBody: (model, systemPrompt, messages) => ({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
    parseResponse: (data) => data.choices?.[0]?.message?.content ?? '',
  },

  local: {
    url: 'http://localhost:1234/v1/chat/completions',
    model: 'local-model',
    buildHeaders: () => ({ 'Content-Type': 'application/json' }),
    buildBody: (model, systemPrompt, messages) => ({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
    parseResponse: (data) => data.choices?.[0]?.message?.content ?? '',
  },
};

export const STORAGE_KEY_TUNED_MODEL = 'aeitron_active_tuned_model';

export function getActiveTunedModel() {
  try {
    return localStorage.getItem(STORAGE_KEY_TUNED_MODEL) || null;
  } catch {
    return null;
  }
}

export function setActiveTunedModel(modelId) {
  try {
    if (modelId) {
      localStorage.setItem(STORAGE_KEY_TUNED_MODEL, modelId);
    } else {
      localStorage.removeItem(STORAGE_KEY_TUNED_MODEL);
    }
  } catch {
    // ignore
  }
}

/**
 * Send a message to the active AI provider.
 *
 * @param {string} systemPrompt - The agent's system prompt
 * @param {Array<{role: string, content: string}>} messages - Conversation history
 * @param {string|null} overrideModel - Optional custom or fine-tuned model ID
 * @returns {Promise<string>} The assistant's reply text
 */
export async function sendAgentMessage(systemPrompt, messages, overrideModel = null) {
  const provider = (import.meta.env.VITE_ACTIVE_AI_PROVIDER || 'openai').toLowerCase();
  const apiKey = import.meta.env.VITE_AI_API_KEY || '';
  const baseUrl = import.meta.env.VITE_AI_BASE_URL || '';

  const config = PROVIDER_CONFIG[provider];
  if (!config) {
    throw new Error(`Unknown AI provider: "${provider}". Supported: ${Object.keys(PROVIDER_CONFIG).join(', ')}`);
  }

  if (!apiKey && provider !== 'local') {
    throw new Error('VITE_AI_API_KEY is not set. Add it to your .env file or enter an API key.');
  }

  const model = overrideModel || getActiveTunedModel() || config.model;

  // Build URL — Gemini uses a custom URL builder, others use config.url or baseUrl override
  let url;
  if (config.buildUrl) {
    url = config.buildUrl(baseUrl || null, model, apiKey);
  } else {
    url = baseUrl || config.url;
  }

  const headers = config.buildHeaders(apiKey);
  const body = config.buildBody(model, systemPrompt, messages);

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => 'Unknown error');
    throw new Error(`AI API error (${res.status}): ${errorBody}`);
  }

  const data = await res.json();
  return config.parseResponse(data);
}

export function getActiveProvider() {
  return (import.meta.env.VITE_ACTIVE_AI_PROVIDER || 'openai').toLowerCase();
}

export function isConfigured() {
  const provider = getActiveProvider();
  const apiKey = import.meta.env.VITE_AI_API_KEY || '';
  return provider === 'local' || !!apiKey;
}

/**
 * OpenAI Live Fine-Tuning API helpers
 */
export async function uploadOpenAiTrainingFile(jsonlString, customApiKey = null) {
  const key = customApiKey || import.meta.env.VITE_AI_API_KEY;
  if (!key) throw new Error('OpenAI API key is required to upload training file.');

  const blob = new Blob([jsonlString], { type: 'application/jsonlines' });
  const formData = new FormData();
  formData.append('purpose', 'fine-tune');
  formData.append('file', blob, 'training_dataset.jsonl');

  const res = await fetch('https://api.openai.com/v1/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to upload file (${res.status}): ${errText}`);
  }

  return await res.json();
}

export async function createOpenAiFineTuningJob(fileId, baseModel = 'gpt-4o-mini-2024-07-18', hyperparameters = {}, customApiKey = null) {
  const key = customApiKey || import.meta.env.VITE_AI_API_KEY;
  if (!key) throw new Error('OpenAI API key is required to launch fine-tuning job.');

  const payload = {
    training_file: fileId,
    model: baseModel,
  };

  if (hyperparameters.n_epochs) {
    payload.hyperparameters = { n_epochs: Number(hyperparameters.n_epochs) };
  }
  if (hyperparameters.suffix) {
    payload.suffix = hyperparameters.suffix;
  }

  const res = await fetch('https://api.openai.com/v1/fine_tuning/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to create fine-tuning job (${res.status}): ${errText}`);
  }

  return await res.json();
}

export async function fetchOpenAiFineTuningJobs(customApiKey = null) {
  const key = customApiKey || import.meta.env.VITE_AI_API_KEY;
  if (!key) throw new Error('OpenAI API key is required to list fine-tuning jobs.');

  const res = await fetch('https://api.openai.com/v1/fine_tuning/jobs?limit=10', {
    headers: { Authorization: `Bearer ${key}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch jobs (${res.status}): ${errText}`);
  }

  return await res.json();
}

export async function fetchOpenAiJobEvents(jobId, customApiKey = null) {
  const key = customApiKey || import.meta.env.VITE_AI_API_KEY;
  if (!key) throw new Error('OpenAI API key is required to fetch job events.');

  const res = await fetch(`https://api.openai.com/v1/fine_tuning/jobs/${jobId}/events?limit=20`, {
    headers: { Authorization: `Bearer ${key}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch events (${res.status}): ${errText}`);
  }

  return await res.json();
}

