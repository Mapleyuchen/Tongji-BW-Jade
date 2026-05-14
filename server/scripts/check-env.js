import fs from 'node:fs';
import path from 'node:path';

const required = ['src/server.js', 'src/app.js', 'src/routes/jade.routes.js'];
const missing = required.filter((file) => !fs.existsSync(path.resolve(process.cwd(), file)));

if (missing.length > 0) {
  console.error(`Missing required files: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Server source check passed.');
