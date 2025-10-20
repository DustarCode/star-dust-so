# 星尘网盘搜索 (Star Dust SO)

星尘网盘搜索是一个现代化的网盘资源聚合搜索平台，支持多种主流网盘资源的搜索和访问。用户可以通过关键词搜索百度网盘、阿里云盘、夸克网盘等多种网盘资源，并直接访问相关资源。
在线体验地址: https://so.dustpix.com/

## 功能特性

- 🔍 **多网盘搜索** - 支持12种主流网盘资源搜索
- 🎯 **精准过滤** - 可按网盘类型筛选搜索结果
- 📅 **智能排序** - 支持按时间和名称排序结果
- 🌙 **深色模式** - 自动适配系统主题或手动切换
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🔗 **一键复制** - 快速复制资源链接和提取码

## 技术架构

### 前端技术栈

- [Next.js 15](https://nextjs.org/) - 基于 React 的全栈 Web 框架
- [TypeScript](https://www.typescriptlang.org/) - 静态类型检查的 JavaScript 超集
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - 基于 Radix UI 和 Tailwind CSS 的组件库
- [React 19](https://reactjs.org/) - 用于构建用户界面的 JavaScript 库

### 后端与服务

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/router-handlers) - 服务端 API 路由
- [Vercel](https://vercel.com/) - 云端部署和托管平台

### 开发工具链

- [ESLint](https://eslint.org/) - JavaScript/TypeScript 代码质量检查工具
- [Prettier](https://prettier.io/) - 代码格式化工具
- [npm](https://www.npmjs.com/) - 包管理器

## 支持的网盘类型

- 百度网盘
- 阿里云盘
- 夸克网盘
- 天翼云盘
- UC网盘
- 移动云盘
- 115网盘
- PikPak
- 迅雷云盘
- 123网盘
- 磁力链接
- 电驴链接

## 环境要求

- Node.js >= 18.17.0
- npm >= 8.0.0

## 快速开始

### 克隆项目

```bash
git clone <repository-url>
cd star-dust-so
```

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建以下环境变量文件：

```bash
# .env.local (开发环境)
NEXT_PUBLIC_API_SEARCH_URL=https://so.252035.xyz/api/search

# .env.production (生产环境)
NEXT_PUBLIC_API_SEARCH_URL=https://so.252035.xyz/api/search
```

### 启动开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 项目结构

```
star-dust-so/
├── src/
│   ├── app/                  # 应用路由和页面
│   │   ├── api/search/       # 搜索API代理
│   │   ├── layout.tsx        # 根布局
│   │   └── page.tsx          # 主页
│   ├── components/           # UI组件
│   │   ├── ui/               # 基础UI组件 (shadcn/ui)
│   │   └── header.tsx        # 页面头部组件
│   └── lib/                  # 工具库
├── public/                   # 静态资源
├── .env.local                # 本地环境变量
├── .env.production           # 生产环境变量
├── next.config.ts            # Next.js 配置
└── package.json              # 项目依赖和脚本
```

## 开发指南

### 项目配置

- 使用 `src/` 目录组织源代码
- 使用 App Router 进行页面路由管理
- 集成 Tailwind CSS 进行样式开发
- 配置了 ESLint 进行代码规范检查

### 自定义脚本

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 使用测试API启动开发服务器
npm run dev:test

# 使用生产API启动开发服务器
npm run dev:prod
```

### 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NEXT_PUBLIC_API_SEARCH_URL` | 搜索API地址 | `https://so.252035.xyz/api/search` |

## 部署

推荐使用 [Vercel](https://vercel.com/) 进行部署，只需连接 Git 仓库即可自动部署。

### Vercel 部署步骤

1. 注册并登录 Vercel 账号
2. 创建新项目并导入 Git 仓库
3. 配置环境变量
4. 点击部署

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进项目。

### 开发流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证，详情请查看 [LICENSE](LICENSE) 文件。

## 免责声明

本站资源均来源于网络，仅供学习交流使用，严禁商业用途。我们不存储任何文件，仅提供搜索服务。使用本站即表示您同意遵守相关法律法规，由此产生的责任与本站无关。
