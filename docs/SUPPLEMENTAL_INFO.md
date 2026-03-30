# 项目截图 - 快速上手指南

## 🎯 一键生成所有截图

我已经为你创建了自动化截图脚本！现在你可以一键生成所有项目截图了。

### 快速步骤

#### 1️⃣ 安装截图依赖（首次使用）

打开终端，运行：

```bash
npm run screenshot:setup
```

这会自动安装：

- Playwright（自动化测试工具）
- Chromium 浏览器

#### 2️⃣ 启动项目

在第一个终端窗口运行：

```bash
npm run dev
```

等待服务器启动完成（看到 "Ready" 提示）。

#### 3️⃣ 运行截图脚本

在新的终端窗口运行：

```bash
npm run screenshot
```

脚本会自动：

- 🔐 使用默认账号登录（admin / admin123）
- 📸 截取 6 个关键页面
- 🖼️ 生成高清截图（1920x1080）
- 📊 生成缩略图（800x450）
- 💾 保存到 `screenshots/` 目录

## 📸 将要生成的截图

| 序号 | 页面      | 文件名            | 说明           |
| ---- | --------- | ----------------- | -------------- |
| 1    | 登录页面  | `login.png`       | 用户登录界面   |
| 2    | 主界面    | `home.png`        | 项目整体布局   |
| 3    | 仪表板    | `dashboard.png`   | 数据统计展示   |
| 4    | 用户管理  | `users.png`       | 用户列表和管理 |
| 5    | 数据分析  | `analytics.png`   | 数据分析和报表 |
| 6    | Hook 市场 | `hook-market.png` | Hook 功能展示  |

## 🎨 截图效果

- **高清截图**: 1920x1080，适合用于 README 展示
- **缩略图**: 800x450，适合用作预览
- **格式**: PNG，支持透明背景
- **动画**: 已禁用，确保截图稳定

## 📁 文件位置

截图会保存在以下位置：

```
next-admin-starter/
└── screenshots/
    ├── login.png
    ├── login-thumb.png
    ├── home.png
    ├── home-thumb.png
    ├── dashboard.png
    ├── dashboard-thumb.png
    ├── users.png
    ├── users-thumb.png
    ├── analytics.png
    ├── analytics-thumb.png
    ├── hook-market.png
    ├── hook-market-thumb.png
    ├── README.md
    ├── QUICKSTART.md
    └── ...
```

## 🔧 故障排除

### 问题 1: Playwright 安装失败

**解决方案**:

```bash
# 清理缓存
npm cache clean --force

# 重新安装
npm run screenshot:setup
```

### 问题 2: 浏览器下载失败

**解决方案**:

```bash
# 手动安装 Chromium
npx playwright install chromium
```

### 问题 3: 服务器未运行

**解决方案**:

确保开发服务器正在运行：

```bash
npm run dev
```

看到 "Ready" 提示后再运行截图脚本。

### 问题 4: 端口被占用

**解决方案**:

如果端口 7001 被占用，可以：

1. 停止占用端口的进程
2. 或修改 `package.json` 中的端口号

### 问题 5: 登录失败

**解决方案**:

确保使用正确的登录凭据：

- 用户名: `admin`
- 密码: `admin123`

如果密码已修改，需要更新 `scripts/screenshot.js` 中的凭据。

## 📚 详细文档

- [快速截图指南](../screenshots/QUICKSTART.md) - 简洁的使用说明
- [截图脚本文档](../scripts/README.md) - 技术细节
- [截图说明](../screenshots/README.md) - 手动截图方法

## 💡 提示

1. **首次使用**: 需要安装 Playwright，可能需要几分钟
2. **网络问题**: 如果 Chromium 下载失败，可以使用国内镜像
3. **更新截图**: 每次修改 UI 后，记得重新生成截图
4. **GitHub**: 截图可以直接提交到 GitHub 仓库

## 🎉 完成！

截图完成后，你将得到：

✅ 6 张高清截图（用于 README）  
✅ 6 张缩略图（用于预览）  
✅ 完整的截图文档

现在可以将这些截图上传到 GitHub，让你的项目更加专业和吸引人！

---

如有问题，请查看详细文档或提交 Issue。
