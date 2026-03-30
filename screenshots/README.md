# 项目截图说明

此目录用于存放项目截图，用于在 README.md 中展示。

## 🚀 快速开始（自动化截图）

**推荐使用自动化截图脚本**，一键生成所有截图：

### 步骤 1: 安装截图依赖（首次使用）

```bash
npm run screenshot:setup
```

这将自动安装 Playwright 和 Chromium 浏览器。

### 步骤 2: 启动项目

```bash
npm run dev
```

### 步骤 3: 运行截图脚本

在新的终端窗口中运行：

```bash
npm run screenshot
```

脚本会自动：

- 截取 5 个关键页面的高清截图（1920x1080）
- 为每个页面生成缩略图（800x450）
- 保存到 `screenshots/` 目录

### 截图内容

自动化脚本会生成以下截图：

| 文件名            | 页面      | 说明           |
| ----------------- | --------- | -------------- |
| `home.png`        | 首页      | 项目整体布局   |
| `dashboard.png`   | 仪表板    | 数据统计展示   |
| `users.png`       | 用户管理  | 用户列表和管理 |
| `analytics.png`   | 数据分析  | 数据分析和报表 |
| `hook-market.png` | Hook 市场 | Hook 功能展示  |

---

## 需要的截图

请按照以下要求添加截图：

### 1. home.png - 主界面截图

- 展示项目的整体布局
- 包含侧边栏菜单、顶部导航栏、仪表板内容
- 建议尺寸: 1920x1080 或 1280x720
- 格式: PNG

### 2. users.png - 用户管理页面截图

- 展示用户管理功能
- 包含搜索表单、数据表格、操作按钮
- 建议尺寸: 1920x1080 或 1280x720
- 格式: PNG

### 3. analytics.png - 数据分析页面截图

- 展示数据分析和图表功能
- 包含统计卡片、图表组件
- 建议尺寸: 1920x1080 或 1280x720
- 格式: PNG

## 截图工具推荐

### Windows

- **Snipaste** - 强大的截图和贴图工具（推荐）
- **ShareX** - 免费开源的截图和录屏工具
- **系统自带截图工具** - Win + Shift + S

### macOS

- **Screenshot** - 系统自带截图工具
- **CleanShot X** - 专业的截图工具
- **Shottr** - 轻量级截图工具

### Linux

- **Flameshot** - 强大的截图工具
- **Shutter** - 功能丰富的截图工具
- **系统自带** - 通常都有截图快捷键

## 截图步骤

### Windows (使用 Snipaste)

1. 启动项目: `npm run dev`
2. 打开浏览器访问: `http://localhost:7001`
3. 使用 F1 键启动截图
4. 选择需要截图的区域
5. 保存为 PNG 格式，命名为对应的文件名
6. 放置到本目录

### macOS

1. 启动项目: `npm run dev`
2. 打开浏览器访问: `http://localhost:7001`
3. 使用 Command + Shift + 4 截取选定区域
4. 截图会自动保存到桌面
5. 重命名为对应的文件名
6. 移动到本目录

## 截图建议

- 使用高分辨率（建议 1920x1080）
- 确保界面元素清晰可见
- 避免显示敏感信息（如真实的用户数据）
- 保持截图风格统一
- 可以适当美化（添加阴影、圆角等）

## 自动化截图（可选）

如果需要自动化生成截图，可以使用以下工具：

- **Playwright** - 浏览器自动化测试工具，支持截图
- **Puppeteer** - Node.js 的无头 Chrome 控制库
- **Cypress** - 端到端测试框架，支持截图

示例脚本 (使用 Playwright):

```javascript
// screenshots.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  // 主界面
  await page.goto('http://localhost:7001');
  await page.screenshot({ path: 'screenshots/home.png' });

  // 用户管理页面
  await page.goto('http://localhost:7001/examples/users');
  await page.screenshot({ path: 'screenshots/users.png' });

  // 数据分析页面
  await page.goto('http://localhost:7001/analytics');
  await page.screenshot({ path: 'screenshots/analytics.png' });

  await browser.close();
})();
```

运行脚本:

```bash
npm install playwright
npx playwright install chromium
node screenshots.js
```

## 注意事项

- 确保截图文件名与 README.md 中的引用一致
- 截图文件会被提交到 Git 仓库
- 建议定期更新截图以反映最新功能
- 避免截图过大（建议每个文件不超过 2MB）

## 临时占位符

如果你暂时没有截图，可以使用以下占位符服务：

- [Placehold.co](https://placehold.co/) - 生成占位符图片
- [Placeholder.com](https://placeholder.com/) - 另一个占位符服务

示例:

```markdown
![主界面](https://placehold.co/1920x1080/4f9bfa/ffffff?text=Home+Page)
```

## 更新 README

添加截图后，README.md 会自动显示这些图片。确保图片路径正确：

```markdown
![主界面](screenshots/home.png)
```

---

**提示**: 好的截图可以显著提升项目的吸引力和专业度！
