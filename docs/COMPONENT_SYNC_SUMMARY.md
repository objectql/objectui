# Component Sync Tools Summary

## 问题 / Problem
对比目前 components 基础组件 和 https://ui.shadcn.com/docs/components 的实现差异，要求全部使用基础组件，需要有脚本来更新最新版本。

Compare current component implementations with https://ui.shadcn.com/docs/components, ensure all use base components, and need scripts to update to latest versions.

## 解决方案 / Solution

已创建完整的组件同步工具集，包括：
Created a complete component sync toolset including:

### 1. 组件清单 / Component Manifest
**文件:** `packages/components/shadcn-components.json`

- 追踪 46 个 Shadcn 基础组件
- 追踪 14 个自定义 ObjectUI 组件
- 记录每个组件的依赖关系和注册源

- Tracks 46 Shadcn base components
- Tracks 14 custom ObjectUI components  
- Records dependencies and registry sources for each component

### 2. 在线同步脚本 / Online Sync Script
**文件:** `scripts/shadcn-sync.js`

功能 / Features:
- ✓ 检查组件状态 (`pnpm shadcn:check`)
- ✓ 更新单个组件 (`pnpm shadcn:update <name>`)
- ✓ 批量更新所有组件 (`pnpm shadcn:update-all`)
- ✓ 对比差异 (`pnpm shadcn:diff <name>`)
- ✓ 列出所有组件 (`pnpm shadcn:list`)

要求网络访问 ui.shadcn.com
Requires network access to ui.shadcn.com

### 3. 离线分析脚本 / Offline Analysis Script
**文件:** `scripts/component-analysis.js`

功能 / Features:
- ✓ 分析本地组件 (`pnpm shadcn:analyze`)
- ✓ 识别定制化级别（未修改/轻度/重度）
- ✓ 检测 data-slot 属性、自定义变体、暗黑模式增强
- ✓ 提供基于复杂度的更新建议
- ✓ 完全离线工作，无需网络

- Analyze local components
- Identify customization levels (unmodified/light/heavy)
- Detect data-slots, custom variants, dark mode enhancements
- Provide update recommendations based on complexity
- Works completely offline without network

### 4. 自动化工作流 / Automated Workflow
**文件:** `.github/workflows/shadcn-check.yml`

- 每周一自动检查组件更新
- 发现过时组件时创建 Issue
- 可手动触发

- Auto-check for component updates every Monday
- Creates issue when outdated components detected
- Can be manually triggered

### 5. 文档 / Documentation
- `docs/SHADCN_SYNC.md` - 完整同步指南 / Complete sync guide
- `docs/SHADCN_QUICK_START.md` - 快速开始指南 / Quick start guide  
- `packages/components/README_SHADCN_SYNC.md` - 组件同步参考 / Component sync reference

## 使用方法 / Usage

### 快速分析 / Quick Analysis
```bash
# 离线分析（推荐首先运行）
# Offline analysis (recommended to run first)
npm run shadcn:analyze
```

### 检查更新 / Check for Updates
```bash
# 在线检查（需要网络）
# Online check (requires internet)
npm run shadcn:check
```

### 更新组件 / Update Components
```bash
# 更新单个组件（带备份）
# Update single component (with backup)
npm run shadcn:update button -- --backup

# 更新所有组件（带备份）
# Update all components (with backup)
npm run shadcn:update-all
```

### 查看差异 / View Differences
```bash
# 查看特定组件的差异
# View differences for specific component
npm run shadcn:diff button
```

## 分析结果 / Analysis Results

### 组件分类 / Component Classification

**✅ 安全更新 (4个) / Safe to Update (4 components)**
- calendar, sonner, table, toast
- 最小定制化，可直接更新 / Minimal customization, can update directly

**⚠️ 需审查 (37个) / Review Required (37 components)**
- 大多数表单和导航组件 / Most form and navigation components
- 主要定制：data-slot 属性 / Main customization: data-slot attributes
- 更新前需检查差异 / Check differences before updating

**🔧 手动合并 (5个) / Manual Merge (5 components)**
- card, form, label, skeleton, tabs
- 重度定制化（玻璃态效果、表单集成等）/ Heavy customization (glassmorphism, form integration, etc.)
- 需要手动合并更新 / Requires manual merge for updates

**● 不要更新 (14个) / Do Not Update (14 components)**
- button-group, calendar-view, chatbot, combobox, date-picker, empty, field, filter-builder, input-group, item, kbd, spinner, timeline, toaster
- ObjectUI 自定义组件 / ObjectUI custom components
- 不存在于 Shadcn / Not in Shadcn

### 依赖关系 / Dependencies
- 27 个 Radix UI 包 / 27 Radix UI packages
- 7 个外部依赖 / 7 external dependencies

## 工作流建议 / Recommended Workflow

### 方案1: 更新单个安全组件 / Update Single Safe Component
```bash
npm run shadcn:analyze              # 1. 分析 / Analyze
npm run shadcn:update toast -- --backup  # 2. 更新 / Update
git diff packages/components/src/ui/toast.tsx  # 3. 检查 / Review
# 4. 测试和提交 / Test and commit
```

### 方案2: 批量更新组件 / Batch Update Components
```bash
git checkout -b chore/update-shadcn  # 1. 创建分支 / Create branch
npm run shadcn:update-all           # 2. 更新所有 / Update all
git diff packages/components/src/ui/ # 3. 审查变更 / Review changes
# 4. 测试、提交、推送 / Test, commit, push
```

### 方案3: 手动更新定制组件 / Manual Update Custom Components
1. 访问 Shadcn 文档获取最新代码 / Visit Shadcn docs for latest code
2. 复制组件代码 / Copy component code
3. 调整导入路径 / Adjust import paths
4. 恢复 ObjectUI 定制化 / Restore ObjectUI customizations
5. 测试并提交 / Test and commit

## 下一步 / Next Steps

建议定期（每月或每季度）运行分析脚本，检查是否有需要更新的组件。

Recommended to run analysis script periodically (monthly or quarterly) to check for components needing updates.

使用 GitHub Actions 工作流自动化检查过程。

Use GitHub Actions workflow to automate the checking process.

## 相关链接 / Related Links

- [Shadcn UI 文档 / Shadcn UI Docs](https://ui.shadcn.com)
- [Radix UI 文档 / Radix UI Docs](https://www.radix-ui.com)
- [完整同步指南 / Full Sync Guide](./SHADCN_SYNC.md)
- [快速开始 / Quick Start](./SHADCN_QUICK_START.md)
