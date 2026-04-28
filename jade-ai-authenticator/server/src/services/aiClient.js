import { env } from '../config/env.js';
import { upstreamError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

function getProviderConfig() {
  if (env.AI_PROVIDER === 'dashscope') {
    if (!env.DASHSCOPE_API_KEY || env.DASHSCOPE_API_KEY.includes('replace_with')) {
      throw upstreamError('未配置 DASHSCOPE_API_KEY，无法调用真实玉石鉴别模型。', 'AI_KEY_NOT_CONFIGURED');
    }
    return {
      provider: 'dashscope',
      apiKey: env.DASHSCOPE_API_KEY,
      baseUrl: env.DASHSCOPE_BASE_URL.replace(/\/$/, ''),
      model: env.DASHSCOPE_MODEL
    };
  }

  if (!env.OPENAI_API_KEY || env.OPENAI_API_KEY.includes('replace_with')) {
    throw upstreamError('未配置 OPENAI_API_KEY，无法调用真实玉石鉴别模型。', 'AI_KEY_NOT_CONFIGURED');
  }
  return {
    provider: 'openai',
    apiKey: env.OPENAI_API_KEY,
    baseUrl: env.OPENAI_BASE_URL.replace(/\/$/, ''),
    model: env.OPENAI_MODEL
  };
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.AI_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw upstreamError('AI 服务响应超时。', 'AI_TIMEOUT');
    }
    throw upstreamError('AI 服务连接失败。', 'AI_CONNECTION_FAILED', { message: error.message });
  } finally {
    clearTimeout(timeout);
  }
}

export async function analyzeJadeImages({ images, prompt, requestId }) {
  const config = getProviderConfig();
  const endpoint = `${config.baseUrl}/chat/completions`;

  const content = [
    { type: 'text', text: prompt },
    ...images.map((image) => ({
      type: 'image_url',
      image_url: {
        url: image.dataUrl,
        detail: 'high'
      }
    }))
  ];

  const body = {
    model: config.model,
    temperature: env.AI_TEMPERATURE,
    messages: [
      {
        role: 'system',
        content: '你是严谨、保守、负责任的珠宝玉石图像辅助鉴别助手。必须综合多张图片证据，输出严格 JSON。'
      },
      {
        role: 'user',
        content
      }
    ]
  };

  logger.info('Calling AI provider', {
    requestId,
    provider: config.provider,
    model: config.model,
    imageCount: images.length
  });

  const response = await fetchWithTimeout(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const responseText = await response.text();
  let payload;
  try {
    payload = JSON.parse(responseText);
  } catch {
    throw upstreamError('AI 服务返回了非 JSON 响应。', 'AI_NON_JSON_RESPONSE', {
      status: response.status,
      preview: responseText.slice(0, 500)
    });
  }

  if (!response.ok) {
    throw upstreamError('AI 服务调用失败。', 'AI_PROVIDER_ERROR', {
      status: response.status,
      provider: config.provider,
      message: payload?.error?.message || payload?.message || 'Unknown provider error'
    });
  }

  const modelContent = payload?.choices?.[0]?.message?.content;
  if (!modelContent) {
    throw upstreamError('AI 服务响应中没有 choices[0].message.content。', 'AI_EMPTY_CHOICE', {
      provider: config.provider,
      payloadPreview: JSON.stringify(payload).slice(0, 800)
    });
  }

  return {
    text: modelContent,
    meta: {
      provider: config.provider,
      model: payload.model || config.model
    }
  };
}
