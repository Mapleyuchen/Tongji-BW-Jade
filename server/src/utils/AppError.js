export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = undefined) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (message, code = 'BAD_REQUEST', details) => new AppError(message, 400, code, details);
export const unauthorized = (message, code = 'UNAUTHORIZED', details) => new AppError(message, 401, code, details);
export const tooManyRequests = (message, code = 'TOO_MANY_REQUESTS', details) => new AppError(message, 429, code, details);
export const upstreamError = (message, code = 'UPSTREAM_ERROR', details) => new AppError(message, 502, code, details);
