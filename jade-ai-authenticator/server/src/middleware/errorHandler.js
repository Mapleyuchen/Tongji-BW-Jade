import multer from 'multer';
import { logger } from '../utils/logger.js';

const exposedServerCodes = new Set([
  'AI_KEY_NOT_CONFIGURED',
  'AI_PROVIDER_ERROR',
  'AI_TIMEOUT',
  'AI_CONNECTION_FAILED',
  'INVALID_AI_JSON',
  'AI_NON_JSON_RESPONSE'
]);

export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `接口不存在：${req.method} ${req.originalUrl}`
    }
  });
}

function normalizeMulterError(error) {
  if (!(error instanceof multer.MulterError)) return null;

  if (error.code === 'LIMIT_FILE_SIZE') {
    return {
      statusCode: 400,
      code: 'IMAGE_TOO_LARGE',
      message: '图片文件过大，请压缩到系统限制以内后重试。'
    };
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return {
      statusCode: 400,
      code: 'TOO_MANY_FILES',
      message: '一次只能上传一张玉石图片。'
    };
  }

  return {
    statusCode: 400,
    code: 'UPLOAD_ERROR',
    message: '图片上传失败，请检查文件后重试。'
  };
}

export function errorHandler(error, req, res, next) {
  const uploadError = normalizeMulterError(error);
  const normalized = uploadError || error;
  const statusCode = Number(normalized.statusCode || 500);
  const safeStatus = statusCode >= 400 && statusCode < 600 ? statusCode : 500;
  const code = normalized.code || 'INTERNAL_ERROR';

  if (safeStatus >= 500) {
    logger.error(normalized.message, {
      code,
      stack: normalized.stack,
      path: req.originalUrl
    });
  } else {
    logger.warn(normalized.message, {
      code,
      path: req.originalUrl
    });
  }

  const shouldExposeMessage = safeStatus < 500 || exposedServerCodes.has(code);

  res.status(safeStatus).json({
    success: false,
    error: {
      code,
      message: shouldExposeMessage ? normalized.message : '服务器处理失败，请稍后重试或联系管理员。',
      details: normalized.details
    }
  });
}
