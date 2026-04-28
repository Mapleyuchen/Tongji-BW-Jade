import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(8080),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  MAX_IMAGE_MB: z.coerce.number().positive().default(8),
  MAX_IMAGES: z.coerce.number().int().positive().max(10).default(6),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(30),

  AI_PROVIDER: z.enum(['dashscope', 'openai']).default('dashscope'),
  DASHSCOPE_API_KEY: z.string().optional(),
  DASHSCOPE_BASE_URL: z.string().url().default('https://dashscope.aliyuncs.com/compatible-mode/v1'),
  DASHSCOPE_MODEL: z.string().default('qwen3-vl-flash'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_BASE_URL: z.string().url().default('https://api.openai.com/v1'),
  OPENAI_MODEL: z.string().default('gpt-4.1-mini'),
  AI_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.1),
  AI_TIMEOUT_MS: z.coerce.number().int().positive().default(60_000)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Environment variable validation failed:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
