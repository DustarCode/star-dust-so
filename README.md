# Star Dust SO

这是一个使用现代 Web 技术构建的应用程序。

## 技术栈

- [Next.js](https://nextjs.org/) - React 框架，用于生产环境的 SSR 应用
- [React](https://reactjs.org/) - JavaScript 库，用于构建用户界面
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集，添加了静态类型定义
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [ESLint](https://eslint.org/) - JavaScript 和 TypeScript 的代码质量检查工具
- [shadcn/ui](https://ui.shadcn.com/) - 基于 Tailwind CSS 的可访问 UI 组件

## 项目配置

- 使用 `src/` 目录组织源代码
- 使用 App Router 进行页面路由管理
- 集成 Tailwind CSS 进行样式开发
- 配置了 ESLint 进行代码规范检查

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 初始化 shadcn/ui

```bash
npx shadcn@latest init
```

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 学习资源

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 特性和 API
- [Learn Next.js](https://nextjs.org/learn) - 交互式教程
- [Tailwind CSS 文档](https://tailwindcss.com/docs) - Tailwind CSS 使用指南
- [shadcn/ui 文档](https://ui.shadcn.com/docs) - shadcn/ui 使用指南