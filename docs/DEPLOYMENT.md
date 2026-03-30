# 部署指南

本文档介绍如何将 Next Admin Starter 部署到不同的平台。

## 目录

- [部署方式](#部署方式)
- [平台部署](#平台部署)
- [Docker 部署](#docker-部署)
- [Nginx 部署](#nginx-部署)
- [环境变量配置](#环境变量配置)
- [性能优化](#性能优化)
- [安全建议](#安全建议)

## 部署方式

Next Admin Starter 支持以下部署方式：

1. **托管平台** - Vercel、Netlify、GitHub Pages（推荐）
2. **自托管** - Docker、Nginx、Apache
3. **云服务** - AWS、阿里云、腾讯云

## 平台部署

### Vercel（推荐）

Vercel 是 Next.js 官方推荐的部署平台，提供最佳性能和开发者体验。

#### 步骤 1: 准备代码

```bash
# 确保代码已提交到 GitHub
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

#### 步骤 2: 连接 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的 GitHub 仓库
5. 点击 "Import"

#### 步骤 3: 配置项目

```javascript
// vercel.json（可选）
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_BASE_URL": "https://your-api.com/api"
  }
}
```

#### 步骤 4: 部署

点击 "Deploy" 按钮，Vercel 会自动构建和部署你的项目。

#### 步骤 5: 配置域名（可选）

1. 在项目设置中点击 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS

### Netlify

Netlify 是另一个优秀的静态网站托管平台。

#### 步骤 1: 准备代码

```bash
# 添加 netlify.toml 配置
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### 步骤 2: 连接 Netlify

1. 访问 [netlify.com](https://netlify.com)
2. 使用 GitHub 账号登录
3. 点击 "New site from Git"
4. 选择你的 GitHub 仓库
5. 配置构建设置

#### 步骤 3: 配置环境变量

在 Netlify Dashboard 中添加：

- `NEXT_PUBLIC_API_BASE_URL`

#### 步骤 4: 部署

点击 "Deploy site" 按钮。

### GitHub Pages

GitHub Pages 提供免费的静态网站托管。

#### 步骤 1: 安装 gh-pages

```bash
npm install --save-dev gh-pages
```

#### 步骤 2: 更新 package.json

```json
{
  "scripts": {
    "export": "next build && next export",
    "deploy": "gh-pages -d out"
  }
}
```

#### 步骤 3: 更新 next.config.mjs

```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

#### 步骤 4: 部署

```bash
npm run export
npm run deploy
```

## Docker 部署

### 创建 Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# 依赖安装阶段
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# 构建阶段
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 创建 .dockerignore

```
node_modules
.next
.git
.env.local
.env.production
npm-debug.log
Dockerfile
docker-compose.yml
```

### 构建镜像

```bash
docker build -t next-admin-starter .
```

### 运行容器

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://your-api.com/api \
  next-admin-starter
```

### 使用 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_BASE_URL=https://your-api.com/api
      - NODE_ENV=production
    restart: always
```

运行：

```bash
docker-compose up -d
```

## Nginx 部署

### 构建项目

```bash
npm run build
```

### 配置 Nginx

```nginx
# /etc/nginx/sites-available/next-admin-starter

upstream nextjs {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 使用 PM2 运行

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "next-admin" -- start

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

### 使用 Systemd

```ini
# /etc/systemd/system/next-admin-starter.service

[Unit]
Description=Next Admin Starter
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/next-admin-starter
Environment="NODE_ENV=production"
Environment="PORT=3000"
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl enable next-admin-starter
sudo systemctl start next-admin-starter
```

## 环境变量配置

### 生产环境变量

创建 `.env.production`：

```bash
# 生产环境配置
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_APP_TITLE=Next Admin Starter
NEXT_PUBLIC_ENV=production
```

### Vercel 环境变量

在 Vercel Dashboard 中设置：

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_APP_TITLE`
- `NEXT_PUBLIC_ENV`

### Docker 环境变量

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api \
  -e NEXT_PUBLIC_APP_TITLE=Next Admin Starter \
  -e NEXT_PUBLIC_ENV=production \
  next-admin-starter
```

## 性能优化

### 1. 启用压缩

```javascript
// next.config.mjs
const nextConfig = {
  compress: true,
};
```

### 2. 配置缓存

```nginx
# Nginx 缓存配置
location /_next/static {
    expires 365d;
    add_header Cache-Control "public, immutable";
}
```

### 3. 启用 CDN

使用 CDN 加速静态资源：

- Vercel: 自动启用
- Cloudflare: 配置 CDN 缓存规则
- AWS CloudFront: 配置分发

### 4. 图片优化

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['your-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
};
```

### 5. 代码分割

```javascript
// 动态导入
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

## 安全建议

### 1. HTTPS 配置

```nginx
# Let's Encrypt SSL 证书
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
}
```

### 2. 安全头部

```javascript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

### 3. 环境变量保护

- 不要在代码中硬编码敏感信息
- 使用 `.env.local` 文件（不要提交到 Git）
- 在部署平台配置环境变量

### 4. API 密钥保护

```javascript
// 服务器端使用环境变量
const apiKey = process.env.API_KEY;

// 不要暴露给客户端
// ❌ 错误
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

// ✅ 正确 - 仅在服务器端使用
const apiKey = process.env.API_KEY;
```

## 监控和日志

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 错误追踪

使用 Sentry 捕获错误：

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### 日志管理

```javascript
// 使用 winston 或 pino
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

## 故障排除

### 构建失败

```bash
# 清除缓存
rm -rf .next node_modules
npm install
npm run build
```

### 环境变量未生效

- 确保变量名以 `NEXT_PUBLIC_` 开头（客户端可访问）
- 重新构建项目
- 检查部署平台的配置

### 样式加载失败

- 检查 Tailwind CSS 配置
- 确保所有样式文件正确导入
- 清除浏览器缓存

## 相关文档

- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Vercel 部署指南](https://vercel.com/docs/deployments/overview)
- [Docker 官方文档](https://docs.docker.com/)
- [Nginx 官方文档](https://nginx.org/en/docs/)

---

如有部署问题，请查看 [故障排除](#故障排除) 或提交 Issue。
