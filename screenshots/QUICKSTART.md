# 快速截图指南

## 🎯 一键生成所有截图

### 方式 1: 使用自动化脚本（推荐）

```bash
# 步骤 1: 安装依赖（首次使用）
npm run screenshot:setup

# 步骤 2: 启动项目
npm run dev

# 步骤 3: 运行截图脚本（在新终端）
npm run screenshot
```

就这么简单！脚本会自动：

- ✅ 登录系统
- ✅ 截取所有关键页面
- ✅ 生成高清截图（1920x1080）
- ✅ 生成缩略图（800x450）
- ✅ 保存到 `screenshots/` 目录

### 方式 2: 手动截图

1. 启动项目: `npm run dev`
2. 打开浏览器访问: `http://localhost:7001`
3. 登录系统（admin / admin123）
4. 访问各个页面并手动截图

## 📸 将要生成的截图

| 截图                                | 页面      | 说明           |
| ----------------------------------- | --------- | -------------- |
| ![登录页面](login-thumb.png)        | 登录页面  | 用户登录界面   |
| ![主界面](home-thumb.png)           | 主界面    | 项目整体布局   |
| ![仪表板](dashboard-thumb.png)      | 仪表板    | 数据统计展示   |
| ![用户管理](users-thumb.png)        | 用户管理  | 用户列表和管理 |
| ![数据分析](analytics-thumb.png)    | 数据分析  | 数据分析和报表 |
| ![Hook 市场](hook-market-thumb.png) | Hook 市场 | Hook 功能展示  |

## 🎨 截图样式

所有截图都使用统一的配置：

- **分辨率**: 1920x1080（高清） + 800x450（缩略图）
- **格式**: PNG
- **动画**: 已禁用（确保截图稳定）
- **完整页面**: 完整截图整个页面

## 📁 文件位置

- 高清截图: `screenshots/*.png`
- 缩略图: `screenshots/*-thumb.png`

## 🔧 故障排除

### 问题: Playwright 安装失败

```bash
# 尝试清理缓存后重新安装
npm cache clean --force
npm run screenshot:setup
```

### 问题: 截图失败

1. 确保开发服务器正在运行: `npm run dev`
2. 检查端口是否被占用: 默认端口 7001
3. 查看错误信息，根据提示处理

### 问题: 登录失败

确保使用正确的凭据：

- 用户名: `admin`
- 密码: `admin123`

## 💡 提示

- 截图完成后，可以上传到 GitHub
- 建议定期更新截图以反映最新功能
- 如果修改了 UI，记得重新截图

---

详细文档请查看 [README.md](README.md)
