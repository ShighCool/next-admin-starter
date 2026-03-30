# 自动化截图脚本

本目录包含用于自动生成项目截图的脚本。

## 📸 截图脚本

### `screenshot.js`

自动化截图脚本，使用 Playwright 生成项目截图。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm run screenshot:setup
```

这会安装：

- Playwright
- Chromium 浏览器

### 2. 启动项目

```bash
npm run dev
```

### 3. 运行截图

```bash
npm run screenshot
```

## 📋 功能特性

- ✅ 自动登录系统
- ✅ 截取多个页面
- ✅ 生成高清截图（1920x1080）
- ✅ 生成缩略图（800x450）
- ✅ 错误处理和重试
- ✅ 进度显示

## 🎯 截图页面

脚本会自动截取以下页面：

1. 登录页面 (`/login`)
2. 主界面 (`/`)
3. 仪表板 (`/dashboard`)
4. 用户管理 (`/examples/users`)
5. 数据分析 (`/analytics`)
6. Hook 市场 (`/hook-market`)

## ⚙️ 配置

可以在 `screenshot.js` 中修改配置：

```javascript
const CONFIG = {
  viewport: { width: 1920, height: 1080 }, // 视口大小
  baseUrl: 'http://localhost:7001', // 项目地址
  outputDir: './screenshots', // 输出目录
};
```

## 🔐 登录凭据

默认登录凭据：

```javascript
const LOGIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};
```

如果需要修改，请更新 `screenshot.js` 中的凭据。

## 📁 输出文件

截图会保存到 `screenshots/` 目录：

- `login.png` - 登录页面截图
- `home.png` - 主界面截图
- `dashboard.png` - 仪表板截图
- `users.png` - 用户管理截图
- `analytics.png` - 数据分析截图
- `hook-market.png` - Hook 市场截图

同时还会生成缩略图：

- `login-thumb.png`
- `home-thumb.png`
- 等等...

## 🛠️ 故障排除

### Playwright 浏览器未安装

```bash
npx playwright install chromium
```

### 端口冲突

如果端口 7001 被占用，需要：

1. 修改 `next.config.mjs` 或 `package.json` 中的端口
2. 或停止占用 7001 端口的进程

### 登录失败

确保：

- 服务器正在运行
- 登录凭据正确
- 登录功能正常工作

## 📚 相关文档

- [Playwright 文档](https://playwright.dev/)
- [快速截图指南](../screenshots/QUICKSTART.md)
- [截图说明](../screenshots/README.md)

---

如有问题，请查看日志输出或提交 Issue。
