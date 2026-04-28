# 部署说明

## 1. 普通服务器部署

```bash
git clone <your-repo-url>
cd jade-ai-authenticator
npm run install:all
cp .env.example server/.env
vim server/.env
npm run build
npm start
```

建议使用 PM2 托管：

```bash
npm i -g pm2
pm2 start server/src/server.js --name jade-ai-authenticator
pm2 save
```

## 2. Nginx 反向代理示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 3. 生产环境建议

- 使用 HTTPS。
- `NODE_ENV=production`。
- `CLIENT_ORIGIN` 配置为真实前端域名。
- API Key 只放服务器环境变量，不提交到 Git。
- 根据课程演示人数调整 `RATE_LIMIT_MAX`。
- 图片大小限制建议保持在 8MB 以内。
