import { z } from 'zod';
import { badRequest } from '../utils/AppError.js';

const identifySchema = z.object({
  materialHint: z.string().trim().max(80).optional().default(''),
  sceneHint: z.string().trim().max(120).optional().default(''),
  description: z.string().trim().max(500).optional().default('')
});

export function validateIdentifyInput(req, res, next) {
  const parsed = identifySchema.safeParse(req.body);
  if (!parsed.success) {
    next(badRequest('表单字段格式不正确。', 'INVALID_FORM_FIELDS', parsed.error.flatten().fieldErrors));
    return;
  }
  req.validatedBody = parsed.data;
  next();
}
