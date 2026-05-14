import { upstreamError } from '../utils/AppError.js';

const allowedRiskLevels = new Set(['低风险', '中等风险', '高风险', '无法判断']);

function extractJsonObject(text) {
  if (!text || typeof text !== 'string') {
    throw upstreamError('AI 服务没有返回可解析文本。', 'EMPTY_AI_RESPONSE');
  }

  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const first = cleaned.indexOf('{');
    const last = cleaned.lastIndexOf('}');
    if (first >= 0 && last > first) {
      try {
        return JSON.parse(cleaned.slice(first, last + 1));
      } catch {
        // Fall through.
      }
    }
  }

  throw upstreamError('AI 返回内容不是合法 JSON。', 'INVALID_AI_JSON', { preview: cleaned.slice(0, 500) });
}

function normalizeArray(value, fallback, maxItems = 8) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean).slice(0, maxItems);
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }
  return fallback;
}

function normalizeImageEvidence(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (typeof item === 'string') return item.trim();
      const imageIndex = Number(item?.imageIndex) || index + 1;
      const role = String(item?.role || '角度未标明').trim();
      const evidence = String(item?.evidence || item?.summary || '').trim();
      if (!evidence) return '';
      return `第 ${imageIndex} 张（${role}）：${evidence}`;
    })
    .filter(Boolean)
    .slice(0, 10);
}

function clamp01(value, fallback = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(1, Math.max(0, n));
}

export function normalizeJadeReport(rawText, meta) {
  const data = extractJsonObject(rawText);

  const riskLevel = allowedRiskLevels.has(data.riskLevel) ? data.riskLevel : '无法判断';

  return {
    material: String(data.material || '无法判断').trim(),
    authenticity: String(data.authenticity || '无法仅凭图片确认真伪。').trim(),
    riskLevel,
    confidence: clamp01(data.confidence, 0.35),
    imageCount: meta.imageCount || 1,
    imageNames: Array.isArray(meta.imageNames) ? meta.imageNames : [],
    imageEvidence: normalizeImageEvidence(data.imageEvidence),
    visualFeatures: normalizeArray(data.visualFeatures, ['图片可见信息不足，建议重新拍摄更清晰的近景和透光图。']),
    suspiciousPoints: normalizeArray(data.suspiciousPoints, ['未发现足够明确的异常点，但普通照片不能替代仪器检测。']),
    imageQuality: {
      score: clamp01(data.imageQuality?.score, 0.5),
      issues: normalizeArray(data.imageQuality?.issues, ['未提供足够图片质量说明。']),
      retakeAdvice: normalizeArray(data.imageQuality?.retakeAdvice, [
        '建议补充自然光下正面图。',
        '建议补充透光图和局部纹理近景图。'
      ])
    },
    professionalAdvice: String(data.professionalAdvice || '高价值或交易场景建议送具备资质的珠宝玉石检测机构复检。').trim(),
    disclaimer: '本结果仅基于图片进行 AI 辅助分析，不能替代专业珠宝玉石鉴定证书。',
    provider: meta.provider,
    model: meta.model,
    analyzedAt: new Date().toISOString()
  };
}
