# 贡献指南

感谢你有兴趣为 Next Admin Starter 做出贡献！

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [问题反馈](#问题反馈)
- [功能建议](#功能建议)

## 🤝 行为准则

- 尊重所有贡献者
- 接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

## 🚀 如何贡献

### 报告 Bug

如果你发现了 bug，请：

1. 检查 [Issues](https://github.com/yourusername/next-admin-starter/issues) 确认该问题是否已被报告
2. 如果没有，创建一个新的 Issue
3. 在 Issue 中包含：
   - 清晰的标题和描述
   - 复现步骤
   - 期望行为和实际行为
   - 截图或错误信息
   - 环境信息（操作系统、Node.js 版本、浏览器版本）

### 提出新功能

如果你想建议新功能：

1. 检查 [Issues](https://github.com/yourusername/next-admin-starter/issues) 确认该功能是否已被建议
2. 如果没有，创建一个新的 Issue
3. 在 Issue 中说明：
   - 功能的用途和价值
   - 使用场景
   - 可能的实现方案
   - 是否愿意自己实现

### 提交代码

如果你想提交代码更改：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 进行开发并提交更改
4. 推送到你的 fork (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 💻 开发流程

### 环境准备

```bash
# 1. Fork 并克隆仓库
git clone https://github.com/yourusername/next-admin-starter.git
cd next-admin-starter

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

### 创建分支

```bash
# 从 main 分支创建新分支
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

分支命名规范：

- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更新
- `refactor/` - 代码重构
- `test/` - 测试相关
- `chore/` - 构建/工具相关

### 开发

```bash
# 开发模式（使用 Turbopack）
npm run dev

# 代码检查
npm run lint
```

### 测试

确保你的更改：

- 通过代码检查（`npm run lint`）
- 不会破坏现有功能
- 遵循代码规范
- 包含必要的测试（如果有）

### 提交

```bash
# 添加更改的文件
git add .

# 提交（遵循提交规范）
git commit -m "feat: add new feature"

# 推送到你的 fork
git push origin feature/your-feature-name
```

### 创建 Pull Request

1. 访问你的 fork 页面
2. 点击 "New Pull Request"
3. 填写 PR 模板
4. 等待代码审查

## 📝 代码规范

### TypeScript

```typescript
// ✅ 好的做法
interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = (id: number): User => {
  return { id, name: '', email: '' };
};

// ❌ 避免
const getUser = (id) => {
  return { id, name: '', email: '' };
};
```

### React 组件

```typescript
// ✅ 使用 TypeScript
'use client'

import React from 'react'

interface Props {
  title: string
  onClick: () => void
}

export default function Button({ title, onClick }: Props) {
  return <button onClick={onClick}>{title}</button>
}

// ❌ 避免
export default function Button({ title, onClick }) {
  return <button onClick={onClick}>{title}</button>
}
```

### 样式

```typescript
// ✅ 使用内联样式或 CSS 变量
<div style={{ color: 'var(--theme-primary)' }}>
  Content
</div>

// ❌ 避免直接使用硬编码颜色
<div style={{ color: '#4f9bfa' }}>
  Content
</div>
```

### 命名规范

- 组件：PascalCase (`UserProfile.tsx`)
- 函数：camelCase (`getUserById`)
- 常量：UPPER_SNAKE_CASE (`API_BASE_URL`)
- 文件：kebab-case (`user-profile.tsx`)

## 📦 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修改bug的代码变动）
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动
- `perf`: 性能优化
- `ci`: CI/CD 配置文件和脚本的变动

### 示例

```bash
# 新功能
git commit -m "feat(user): add user profile page"

# Bug 修复
git commit -m "fix(auth): resolve login token issue"

# 文档更新
git commit -m "docs(readme): update installation guide"

# 性能优化
git commit -m "perf(table): optimize rendering performance"

# 重构
git commit -m "refactor(api): improve request handling"
```

## 🐛 问题反馈

### 反馈 Bug

提交 Bug Issue 时，请提供：

1. **问题描述** - 清晰简洁地描述问题
2. **复现步骤** - 详细的步骤来重现问题
3. **期望行为** - 你期望发生什么
4. **实际行为** - 实际发生了什么
5. **截图** - 如果适用，添加截图
6. **环境信息**:
   - 操作系统
   - Node.js 版本
   - 浏览器版本
   - 项目版本

### Bug Issue 模板

```markdown
## 问题描述

简要描述问题

## 复现步骤

1. 步骤一
2. 步骤二
3. 步骤三

## 期望行为

描述你期望发生什么

## 实际行为

描述实际发生了什么

## 截图

如果适用，添加截图

## 环境信息

- OS: [例如：Windows 10]
- Node.js: [例如：18.0.0]
- Browser: [例如：Chrome 120]
- Version: [例如：1.0.0]

## 附加信息

任何其他相关信息
```

## 💡 功能建议

提交功能建议时，请提供：

1. **功能描述** - 清晰描述建议的功能
2. **使用场景** - 描述使用该功能的场景
3. **价值** - 说明该功能的价值
4. **实现方案** - 如果有，提供可能的实现方案
5. **是否愿意实现** - 说明你是否愿意自己实现

### 功能 Issue 模板

```markdown
## 功能描述

简要描述建议的功能

## 使用场景

描述使用该功能的场景

## 价值

说明该功能的价值

## 实现方案

如果适用，提供可能的实现方案

## 是否愿意实现

说明你是否愿意自己实现该功能

## 附加信息

任何其他相关信息
```

## 📚 相关文档

- [项目 README](README.md)
- [后端对接指南](docs/API_INTEGRATION.md)
- [项目上下文指南](AGENTS.md)

## 🙏 致谢

感谢所有为 Next Admin Starter 做出贡献的开发者！

---

有任何问题？随时创建 Issue 或联系我们！
