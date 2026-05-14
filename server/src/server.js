import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

app.listen(env.PORT, () => {
  logger.info('Jade AI authenticator server started', {
    port: env.PORT,
    env: env.NODE_ENV,
    provider: env.AI_PROVIDER
  });
});
