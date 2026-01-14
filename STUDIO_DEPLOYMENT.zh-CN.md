# Studio 部署说明 (Studio Deployment Guide)

## 概述 (Overview)

Object UI Studio 现在已经配置为自动部署到官网，用户可以通过以下地址访问：

**访问地址**: `https://objectql.github.io/objectui/studio/`

## 部署架构 (Deployment Architecture)

### 文件结构
```
docs/.vitepress/dist/          # VitePress 文档站点
├── index.html                 # 主页
├── guide/                     # 指南页面
├── api/                       # API 文档
└── studio/                    # Studio 应用（独立子目录）
    ├── index.html
    └── assets/
```

### 工作流程 (Workflow)

1. **构建触发** - 当以下文件有更新时触发部署：
   - `docs/**` - 文档更新
   - `apps/playground/**` - Studio 应用更新
   - `packages/**` - 核心包更新
   - `.github/workflows/deploy-docs.yml` - 工作流配置更新

2. **构建步骤** (`.github/workflows/deploy-docs.yml`):
   ```yaml
   - 安装依赖 (pnpm install)
   - 构建文档站点 (pnpm docs:build)
   - 构建 Studio 应用 (pnpm --filter @apps/playground build)
   - 将 Studio 复制到文档输出目录
   - 部署到 GitHub Pages
   ```

3. **生产环境配置**:
   - Vite 配置了 `base: '/studio/'` 用于生产环境
   - 所有资源路径自动添加 `/studio/` 前缀
   - 确保在嵌套路径下正常工作

## 访问入口 (Access Points)

用户可以通过多种方式访问 Studio：

1. **主页 CTA** - 首页的主要行动按钮 "Try Studio Now"
2. **顶部导航** - 导航栏的 "Studio" 链接
3. **指南文档** - `/guide/studio` 页面包含详细说明
4. **直接访问** - 直接访问 `/studio/` 路径

## 本地测试 (Local Testing)

### 开发模式
```bash
# 启动 Studio 开发服务器
pnpm --filter @apps/playground dev
# 访问 http://localhost:5174
```

### 生产构建测试
```bash
# 构建所有包
pnpm -r build

# 构建文档
pnpm docs:build

# 预览（包含 Studio）
pnpm docs:preview
```

### 模拟完整部署
```bash
# 1. 构建 Studio
NODE_ENV=production pnpm --filter @apps/playground build

# 2. 构建文档
pnpm docs:build

# 3. 复制 Studio 到文档输出目录
mkdir -p docs/.vitepress/dist/studio
cp -r apps/playground/dist/* docs/.vitepress/dist/studio/

# 4. 预览
pnpm docs:preview
# 访问 http://localhost:4173/studio/
```

## 功能特性 (Features)

Studio 提供以下功能供用户体验：

- ✅ **可视化设计器** - 拖放组件设计界面
- ✅ **实时预览** - 所见即所得的编辑体验
- ✅ **代码编辑器** - JSON 架构直接编辑
- ✅ **响应式预览** - 桌面/平板/移动视图切换
- ✅ **示例模板库** - 预置多种示例模板
- ✅ **导出功能** - 导出 JSON 或复制到剪贴板
- ✅ **撤销/重做** - 完整的历史记录管理

## 维护说明 (Maintenance)

### 更新 Studio
1. 修改 `apps/playground/src/` 中的代码
2. 提交到 `main` 分支
3. GitHub Actions 自动构建和部署
4. 几分钟后更新生效

### 添加新示例
编辑 `apps/playground/src/data/examples.ts`：
```typescript
export const examples = {
  'my-example': JSON.stringify({
    type: 'page',
    title: 'My Example',
    body: [...]
  }, null, 2)
};
```

### 修改部署路径
如需更改部署路径，需同步修改：
1. `apps/playground/vite.config.ts` - `base` 配置
2. `.github/workflows/deploy-docs.yml` - 复制目标路径
3. `docs/.vitepress/config.mts` - 导航链接

## 故障排查 (Troubleshooting)

### 问题：Studio 页面 404
- 检查 GitHub Pages 是否已启用
- 确认部署工作流执行成功
- 检查 `base` 配置是否正确

### 问题：资源加载失败
- 检查 Vite 的 `base` 配置
- 确认资源路径包含 `/studio/` 前缀
- 查看浏览器控制台错误信息

### 问题：构建失败
- 检查所有依赖是否已安装
- 确保核心包已成功构建
- 查看 GitHub Actions 日志

## 相关链接 (Related Links)

- 📝 [Studio 使用指南](https://objectql.github.io/objectui/guide/studio)
- 🎨 [在线体验](https://objectql.github.io/objectui/studio/)
- 📦 [项目仓库](https://github.com/objectql/objectui)
- 📖 [完整文档](https://objectql.github.io/objectui/)
