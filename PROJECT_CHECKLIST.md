# 项目文件清单

本文档列出了 Next Admin Starter 项目中的所有重要文件及其用途。

## 根目录文件

### 配置文件

| 文件名               | 用途                    | 是否必需 |
| -------------------- | ----------------------- | -------- |
| `package.json`       | 项目依赖和脚本配置      | ✅ 必需  |
| `tsconfig.json`      | TypeScript 配置         | ✅ 必需  |
| `tailwind.config.ts` | Tailwind CSS 配置       | ✅ 必需  |
| `next.config.mjs`    | Next.js 配置            | ✅ 必需  |
| `postcss.config.mjs` | PostCSS 配置            | ✅ 必需  |
| `.gitignore`         | Git 忽略文件配置        | ✅ 必需  |
| `.eslintrc.json`     | ESLint 代码检查配置     | ✅ 推荐  |
| `.prettierrc`        | Prettier 代码格式化配置 | ✅ 推荐  |
| `.prettierignore`    | Prettier 忽略文件配置   | ✅ 推荐  |
| `.editorconfig`      | 编辑器配置              | ✅ 推荐  |
| `vercel.json`        | Vercel 部署配置         | ⚪ 可选  |
| `netlify.toml`       | Netlify 部署配置        | ⚪ 可选  |
| `Dockerfile`         | Docker 镜像构建配置     | ⚪ 可选  |
| `docker-compose.yml` | Docker Compose 配置     | ⚪ 可选  |
| `.dockerignore`      | Docker 忽略文件配置     | ⚪ 可选  |

### 环境变量文件

| 文件名             | 用途                   | 是否提交到 Git |
| ------------------ | ---------------------- | -------------- |
| `.env.example`     | 环境变量模板           | ✅ 提交        |
| `.env.development` | 开发环境配置           | ✅ 提交        |
| `.env.production`  | 生产环境配置           | ✅ 提交        |
| `.env.local`       | 本地环境配置（不提交） | ❌ 不提交      |

### 文档文件

| 文件名            | 用途           | 是否必需 |
| ----------------- | -------------- | -------- |
| `README.md`       | 项目主文档     | ✅ 必需  |
| `AGENTS.md`       | 项目上下文指南 | ✅ 必需  |
| `CONTRIBUTING.md` | 贡献指南       | ✅ 推荐  |
| `CHANGELOG.md`    | 更新日志       | ✅ 推荐  |
| `LICENSE`         | MIT 许可证     | ✅ 必需  |

### 源代码目录

| 目录              | 用途               | 说明           |
| ----------------- | ------------------ | -------------- |
| `src/`            | 源代码目录         | 所有源代码     |
| `src/app/`        | Next.js App Router | 页面和路由     |
| `src/components/` | React 组件         | 可复用组件     |
| `src/api/`        | API 接口定义       | 后端对接       |
| `src/hooks/`      | 自定义 Hooks       | React Hooks    |
| `src/store/`      | 状态管理           | Zustand stores |
| `src/types/`      | TypeScript 类型    | 类型定义       |
| `src/utils/`      | 工具函数           | 辅助函数       |

### 文档目录

| 目录                      | 用途         | 说明                       |
| ------------------------- | ------------ | -------------------------- |
| `docs/`                   | 文档目录     | 详细文档                   |
| `docs/API_INTEGRATION.md` | 后端对接指南 | Go、PHP、Java、Python 对接 |
| `docs/DEPLOYMENT.md`      | 部署指南     | 各种部署方式               |

### 静态资源目录

| 目录           | 用途     | 说明          |
| -------------- | -------- | ------------- |
| `public/`      | 静态资源 | 图片、字体等  |
| `screenshots/` | 项目截图 | README 展示用 |

## 快速检查清单

### 首次克隆项目后

- [ ] 复制 `.env.example` 到 `.env.local`
- [ ] 安装依赖：`npm install`
- [ ] 启动开发服务器：`npm run dev`
- [ ] 访问 http://localhost:7001

### 准备部署前

- [ ] 配置生产环境变量（`.env.production`）
- [ ] 运行构建：`npm run build`
- [ ] 测试生产构建：`npm run build && npm start`
- [ ] 添加项目截图到 `screenshots/` 目录
- [ ] 更新 `CHANGELOG.md`
- [ ] 更新版本号（`package.json`）

### 提交代码前

- [ ] 运行代码检查：`npm run lint`
- [ ] 运行类型检查：`npm run type-check`
- [ ] 格式化代码：`npm run format`
- [ ] 确保所有测试通过
- [ ] 编写有意义的提交信息

### 推送到 GitHub 前

- [ ] 更新 README.md 中的仓库链接
- [ ] 更新联系方式信息
- [ ] 确认 `.gitignore` 配置正确
- [ ] 确认敏感信息已移除
- [ ] 添加 LICENSE 文件

## 文件大小建议

- `screenshots/*.png`: 每个文件不超过 2MB
- `public/` 目录下的图片: 优化后上传
- 避免提交大文件（超过 10MB）

## 安全检查

- [ ] 确保没有提交 `.env.local`
- [ ] 确保没有提交 API 密钥
- [ ] 确保没有提交敏感配置
- [ ] 检查 `.gitignore` 是否正确配置

## 代码质量检查

- [ ] 运行 `npm run lint` 无错误
- [ ] 运行 `npm run type-check` 无错误
- [ ] 代码符合项目规范
- [ ] 添加必要的注释
- [ ] 更新相关文档

## 文档完整性

- [ ] README.md 信息完整
- [ ] API_INTEGRATION.md 更新
- [ ] DEPLOYMENT.md 更新
- [ ] CHANGELOG.md 更新
- [ ] CONTRIBUTING.md 更新

## 常见问题

### Q: 哪些文件必须提交到 Git？

A: 必须提交的文件包括：

- 所有源代码文件
- 配置文件（`.eslintrc.json`, `.prettierrc`, 等）
- 文件（`README.md`, `LICENSE`, 等）
- 环境变量模板（`.env.example`, `.env.development`, `.env.production`）

### Q: 哪些文件不应该提交到 Git？

A: 不应该提交的文件包括：

- `.env.local` 和其他 `.local` 文件
- `node_modules/`
- `.next/`
- 构建产物
- 敏感配置文件

### Q: 如何添加新文件？

A: 添加新文件时：

1. 确定文件的正确位置
2. 遵循项目命名规范
3. 添加必要的类型定义
4. 更新相关文档
5. 提交前运行检查

### Q: 如何删除不需要的文件？

A: 删除文件时：

1. 确认文件未被使用
2. 更新相关引用
3. 更新文档
4. 提交更改

## 维护建议

1. **定期更新依赖**: 每月检查一次依赖更新
2. **更新文档**: 代码变更时同步更新文档
3. **清理无用文件**: 定期清理过时的文件和依赖
4. **备份配置**: 保留配置文件的备份
5. **版本管理**: 使用语义化版本号

---

如有问题，请参考 [README.md](README.md) 或提交 Issue。
