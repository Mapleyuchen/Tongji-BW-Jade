import fs from 'node:fs';
import path from 'node:path';

const required = ['src/App.jsx', 'src/main.jsx', 'src/api/jadeApi.js'];
const missing = required.filter((file) => !fs.existsSync(path.resolve(process.cwd(), file)));
if (missing.length > 0) {
  console.error(`Missing required files: ${missing.join(', ')}`);
  process.exit(1);
}
console.log('Client source check passed.');
