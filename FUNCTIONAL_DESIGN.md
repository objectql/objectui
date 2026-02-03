# ObjectUI 全面功能设计文档
# ObjectUI Comprehensive Functional Design Document

**文档版本 / Document Version:** 2.0  
**日期 / Date:** 2026年2月3日 / February 3, 2026  
**基于 / Based On:** ObjectUI v0.4.0 + ObjectStack Spec v0.9.x  
**作者 / Author:** ObjectUI Architecture Team  
**目标 / Goal:** 打造全球最优秀的企业管理软件界面框架 / Build the World's Best Enterprise Management Software UI Framework

---

## 📋 执行摘要 / Executive Summary

### 中文摘要

ObjectUI 是一个基于 React + Tailwind CSS + Shadcn UI 构建的通用服务端驱动UI（SDUI）引擎，旨在成为 ObjectStack 生态系统的官方前端渲染器。本文档详细阐述了 ObjectUI 所有组件的功能设计、交互规范、移动端适配策略以及完整的开发计划。

**核心设计目标：**
1. **全球最佳体验**：打造像素级完美、交互流畅、视觉精美的企业管理界面
2. **移动优先**：所有组件原生支持响应式设计，在移动端提供卓越体验
3. **可访问性优先**：100% 符合 WCAG 2.1 AA 标准
4. **性能卓越**：首屏渲染 < 500ms，交互延迟 < 16ms
5. **开发者友好**：完整的 TypeScript 类型支持，零学习曲线

### English Summary

ObjectUI is a universal Server-Driven UI (SDUI) engine built on React + Tailwind CSS + Shadcn UI, designed to be the official frontend renderer for the ObjectStack ecosystem. This document details the functional design, interaction specifications, mobile adaptation strategies, and complete development plan for all ObjectUI components.

**Core Design Goals:**
1. **World-Class Experience**: Pixel-perfect, smooth interactions, visually stunning enterprise management interfaces
2. **Mobile-First**: All components natively support responsive design with excellent mobile experience
3. **Accessibility-First**: 100% compliant with WCAG 2.1 AA standards
4. **Exceptional Performance**: First render < 500ms, interaction latency < 16ms
5. **Developer-Friendly**: Complete TypeScript support, zero learning curve

---

## 🎨 设计哲学 / Design Philosophy

### 1. 视觉设计原则 / Visual Design Principles

#### 1.1 色彩系统 / Color System

**主题色板 / Theme Palette**
```typescript
const colorSystem = {
  // 品牌色 / Brand Colors
  primary: {
    50: '#f0f9ff',   // 最浅 / Lightest
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // 基础色 / Base
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',  // 最深 / Darkest
  },
  
  // 语义色 / Semantic Colors
  semantic: {
    success: '#10b981',  // 成功 - 绿色
    warning: '#f59e0b',  // 警告 - 橙色
    error: '#ef4444',    // 错误 - 红色
    info: '#3b82f6',     // 信息 - 蓝色
  },
  
  // 中性色 / Neutral Colors
  neutral: {
    0: '#ffffff',     // 纯白
    50: '#fafafa',    
    100: '#f5f5f5',   
    200: '#e5e5e5',   
    300: '#d4d4d4',   
    400: '#a3a3a3',   
    500: '#737373',   // 中性灰
    600: '#525252',   
    700: '#404040',   
    800: '#262626',   
    900: '#171717',   
    1000: '#000000',  // 纯黑
  }
};
```

**深色模式 / Dark Mode**
- 自动切换背景色从 neutral[0] 到 neutral[900]
- 文字颜色自动反转
- 阴影替换为边框高亮
- 所有组件支持无缝切换

#### 1.2 排版系统 / Typography System

```typescript
const typography = {
  // 字体家族 / Font Families
  fonts: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", "Cascadia Code", Consolas, monospace',
    display: '"Cal Sans", Inter, sans-serif',
  },
  
  // 字号比例 / Font Scale (Perfect Fourth - 1.333)
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px - 基准
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  // 行高 / Line Heights
  leading: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // 字重 / Font Weights
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }
};
```

#### 1.3 间距系统 / Spacing System

基于 8px 网格系统 / Based on 8px Grid System

```typescript
const spacing = {
  0: '0px',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px  - 基础单位
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
};
```

#### 1.4 圆角系统 / Border Radius System

```typescript
const borderRadius = {
  none: '0px',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.375rem', // 6px - 默认
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',   // 完全圆形
};
```

#### 1.5 阴影系统 / Shadow System

```typescript
const shadows = {
  // 高度感知阴影 / Elevation-aware shadows
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};
```

### 2. 交互设计原则 / Interaction Design Principles

#### 2.1 动效规范 / Animation Specifications

**持续时间 / Durations**
```typescript
const durations = {
  instant: '50ms',    // 即时反馈 (hover, focus)
  fast: '150ms',      // 快速过渡 (tooltips, small modals)
  normal: '300ms',    // 标准过渡 (dialogs, sheets)
  slow: '500ms',      // 慢速过渡 (page transitions)
  verySlow: '1000ms', // 极慢 (特殊效果)
};
```

**缓动函数 / Easing Functions**
```typescript
const easings = {
  // 标准 / Standard
  default: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  
  // 进入 / Enter
  in: 'cubic-bezier(0.4, 0.0, 1, 1)',
  
  // 退出 / Exit  
  out: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  
  // 进出 / In-Out
  inOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  
  // 弹性 / Elastic
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};
```

**动画原则 / Animation Principles**
1. **性能优先**：仅动画 transform 和 opacity 属性
2. **意义明确**：动画必须传达明确的状态变化
3. **减少干扰**：用户可以通过系统设置禁用动画
4. **微妙自然**：避免过度动画，保持专业感

#### 2.2 反馈机制 / Feedback Mechanisms

**视觉反馈 / Visual Feedback**
- **Hover**: 亮度提升 10%，过渡 50ms
- **Active**: 缩放 0.98，过渡 50ms  
- **Focus**: 2px 蓝色轮廓，offset 2px
- **Loading**: Spinner + 禁用状态 + 透明度 50%
- **Success**: 绿色对勾图标 + 淡入动画
- **Error**: 红色感叹号 + 抖动动画

**触觉反馈 / Haptic Feedback (移动端)**
- 按钮点击：轻微震动 (10ms)
- 开关切换：中等震动 (20ms)
- 错误提示：强烈震动 (30ms)
- 成功操作：两次短震动 (10ms x2)

#### 2.3 响应式断点 / Responsive Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // 小屏手机 Small phones
  md: '768px',   // 平板 Tablets  
  lg: '1024px',  // 笔记本 Laptops
  xl: '1280px',  // 桌面 Desktops
  '2xl': '1536px', // 大屏 Large screens
};
```

**移动优先策略 / Mobile-First Strategy**
1. 默认设计针对 320px 宽度
2. 逐步增强至更大屏幕
3. 触摸目标最小 44x44px
4. 文字最小 16px (防止缩放)

---

## 📦 组件分类与功能设计 / Component Categories & Functional Design

### 目录 / Table of Contents

1. [基础组件 / Foundation Components](#1-基础组件--foundation-components)
2. [布局组件 / Layout Components](#2-布局组件--layout-components)
3. [表单组件 / Form Components](#3-表单组件--form-components)
4. [数据展示组件 / Data Display Components](#4-数据展示组件--data-display-components)
5. [反馈组件 / Feedback Components](#5-反馈组件--feedback-components)
6. [折叠组件 / Disclosure Components](#6-折叠组件--disclosure-components)
7. [浮层组件 / Overlay Components](#7-浮层组件--overlay-components)
8. [导航组件 / Navigation Components](#8-导航组件--navigation-components)
9. [复杂组件 / Complex Components](#9-复杂组件--complex-components)
10. [业务组件 / Business Components](#10-业务组件--business-components)
11. [插件组件 / Plugin Components](#11-插件组件--plugin-components)

---

## 1. 基础组件 / Foundation Components

### 1.1 Text (文本)

**功能定义 / Function Definition**
- 显示格式化文本内容
- 支持多种文本样式和大小
- 支持截断和省略号
- 支持富文本渲染

**属性规范 / Property Specifications**
```typescript
interface TextSchema {
  type: 'text';
  value: string;                    // 文本内容
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;                   // Tailwind color class
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;               // 单行截断
  lineClamp?: number;               // 多行截断
  transform?: 'uppercase' | 'lowercase' | 'capitalize';
  decoration?: 'underline' | 'line-through';
  italic?: boolean;
  font?: 'sans' | 'mono' | 'display';
}
```

**交互规范 / Interaction Specifications**
- 可选择文本
- 支持复制
- 长文本自动换行或截断

**移动端适配 / Mobile Adaptation**
- 最小字号 16px (防止 iOS 自动缩放)
- 行高 1.5 (提升可读性)
- 长按显示复制菜单

**可访问性 / Accessibility**
- `role="text"` 对于装饰性文本
- 支持屏幕阅读器
- 确保足够的对比度 (WCAG AA: 4.5:1)

### 1.2 Button (按钮)

**功能定义 / Function Definition**
- 触发操作的交互元素
- 多种视觉样式表达不同重要性
- 支持加载状态和禁用状态
- 支持图标和文字组合

**属性规范 / Property Specifications**
```typescript
interface ButtonSchema {
  type: 'button';
  text?: string;                    // 按钮文字
  icon?: string;                    // Lucide icon name
  iconPosition?: 'left' | 'right';  // 图标位置
  
  // 视觉变体 / Visual Variants
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  
  // 状态 / States
  loading?: boolean;                // 加载状态
  disabled?: boolean;               // 禁用状态
  
  // 行为 / Behavior
  onClick?: ActionSchema;           // 点击事件
  type?: 'button' | 'submit' | 'reset'; // HTML type
  
  // 样式 / Styling
  fullWidth?: boolean;              // 100% 宽度
  className?: string;
}
```

**视觉规范 / Visual Specifications**

| Variant | 背景色 | 文字色 | 边框 | 使用场景 |
|---------|--------|--------|------|----------|
| default | primary-500 | white | none | 主要操作 |
| destructive | red-500 | white | none | 删除/危险操作 |
| outline | transparent | primary-600 | 1px primary-300 | 次要操作 |
| secondary | neutral-100 | neutral-900 | none | 辅助操作 |
| ghost | transparent | neutral-700 | none | 低优先级操作 |
| link | transparent | primary-600 | none | 链接式操作 |

**尺寸规范 / Size Specifications**

| Size | 高度 | 内边距 | 字号 | 图标大小 |
|------|------|--------|------|----------|
| sm | 32px | 12px 16px | 14px | 16px |
| default | 40px | 16px 24px | 16px | 20px |
| lg | 48px | 20px 32px | 18px | 24px |
| icon | 40px | 12px | - | 20px |

**交互规范 / Interaction Specifications**
1. **Hover**: 亮度 +10%, 过渡 50ms
2. **Active**: 缩放 0.98, 过渡 50ms
3. **Focus**: 2px 蓝色轮廓 offset 2px
4. **Loading**: 
   - 显示 spinner
   - disabled = true
   - 文字透明度 50%
   - 保持原有宽度
5. **Disabled**:
   - 透明度 50%
   - cursor: not-allowed
   - 取消所有交互

**移动端适配 / Mobile Adaptation**
- 最小触摸目标 44x44px
- 默认高度增加到 48px
- 间距增加 4px
- 支持触觉反馈

**可访问性 / Accessibility**
- `role="button"` (非 button 元素时)
- `aria-label` 对于图标按钮
- `aria-disabled="true"` 禁用时
- `aria-busy="true"` 加载时
- 键盘导航支持 (Enter/Space 触发)

### 1.3 Icon (图标)

**功能定义 / Function Definition**
- 显示 Lucide Icons 图标库中的图标
- 支持自定义 SVG 图标
- 支持多种尺寸和颜色

**属性规范 / Property Specifications**
```typescript
interface IconSchema {
  type: 'icon';
  name: string;                     // Lucide icon name
  size?: number | 'sm' | 'base' | 'lg' | 'xl'; // px or preset
  color?: string;                   // Tailwind color class
  strokeWidth?: number;             // 1-3
  className?: string;
}
```

**尺寸预设 / Size Presets**
- sm: 16px
- base: 20px
- lg: 24px
- xl: 32px

**使用场景 / Use Cases**
- 按钮图标
- 状态指示器
- 导航图标
- 装饰性图标

### 1.4 Image (图片)

**功能定义 / Function Definition**
- 展示图片内容
- 支持懒加载
- 支持占位符
- 支持错误处理

**属性规范 / Property Specifications**
```typescript
interface ImageSchema {
  type: 'image';
  src: string;                      // 图片 URL
  alt: string;                      // 替代文本 (必需)
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;             // e.g., '16/9', '4/3', '1/1'
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';       // 懒加载
  placeholder?: string;             // 占位图 URL
  fallback?: string;                // 加载失败显示
  rounded?: boolean | string;       // 圆角
  className?: string;
}
```

**加载状态管理 / Loading State Management**
1. **初始**: 显示 placeholder (skeleton)
2. **加载中**: 淡入过渡
3. **成功**: 显示图片
4. **失败**: 显示 fallback 或默认图标

**移动端适配 / Mobile Adaptation**
- 响应式宽度
- 自动选择合适分辨率 (srcset)
- WebP 优先，JPEG 降级

**可访问性 / Accessibility**
- 必需的 alt 文本
- 装饰性图片 alt=""
- 加载状态通知屏幕阅读器

### 1.5 Separator (分隔线)

**功能定义 / Function Definition**
- 视觉分隔内容区域
- 支持水平和垂直方向
- 可自定义样式

**属性规范 / Property Specifications**
```typescript
interface SeparatorSchema {
  type: 'separator';
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;             // 是否装饰性
  className?: string;
}
```

---

## 2. 布局组件 / Layout Components

### 2.1 Container (容器)

**功能定义 / Function Definition**
- 内容区域的顶层容器
- 响应式最大宽度
- 自动水平居中
- 可配置内边距

**属性规范 / Property Specifications**
```typescript
interface ContainerSchema {
  type: 'container';
  children: SchemaNode | SchemaNode[];
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: number | string;
  centered?: boolean;
  className?: string;
}
```

**最大宽度预设 / Max Width Presets**
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px
- full: 100%

### 2.2 Flex (弹性布局)

**功能定义 / Function Definition**
- 基于 Flexbox 的一维布局
- 支持方向、对齐、间距配置
- 响应式属性

**属性规范 / Property Specifications**
```typescript
interface FlexSchema {
  type: 'flex';
  children: SchemaNode | SchemaNode[];
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number | string;            // Tailwind spacing
  className?: string;
}
```

### 2.3 Grid (网格布局)

**功能定义 / Function Definition**
- 基于 CSS Grid 的二维布局
- 响应式列数
- 自动调整间距

**属性规范 / Property Specifications**
```typescript
interface GridSchema {
  type: 'grid';
  children: SchemaNode | SchemaNode[];
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number | string;
  className?: string;
}
```

**响应式列数示例 / Responsive Columns Example**
```json
{
  "type": "grid",
  "columns": {
    "sm": 1,
    "md": 2,
    "lg": 3,
    "xl": 4
  },
  "gap": 4
}
```

### 2.4 Card (卡片)

**功能定义 / Function Definition**
- 内容分组的视觉容器
- 支持标题、描述、内容、底部操作
- 可交互（hover、click）

**属性规范 / Property Specifications**
```typescript
interface CardSchema {
  type: 'card';
  title?: string | SchemaNode;
  description?: string | SchemaNode;
  children?: SchemaNode | SchemaNode[];
  footer?: SchemaNode | SchemaNode[];
  
  // 视觉样式
  variant?: 'default' | 'outlined' | 'elevated';
  hover?: boolean;                  // hover 效果
  clickable?: boolean;              // 可点击
  onClick?: ActionSchema;
  
  className?: string;
}
```

**视觉规范 / Visual Specifications**
- **default**: 1px 边框, 无阴影
- **outlined**: 2px 边框, 无阴影
- **elevated**: 无边框, md 阴影

**移动端适配 / Mobile Adaptation**
- 边距减少 4px
- 标题字号调整
- 卡片间距增大

### 2.5 Tabs (标签页)

**功能定义 / Function Definition**
- 内容分组切换
- 支持横向和纵向布局
- 键盘导航
- URL 同步（可选）

**属性规范 / Property Specifications**
```typescript
interface TabsSchema {
  type: 'tabs';
  items: TabItem[];
  defaultValue?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  onChange?: ActionSchema;
}

interface TabItem {
  value: string;
  label: string | SchemaNode;
  icon?: string;
  content: SchemaNode | SchemaNode[];
  disabled?: boolean;
}
```

**视觉规范 / Visual Specifications**
- **default**: 底部 2px 指示条
- **pills**: 圆角背景高亮
- **underline**: 底部下划线

**移动端适配 / Mobile Adaptation**
- 横向滚动标签栏
- 最小标签宽度 80px
- 手势滑动切换

---

## 3. 表单组件 / Form Components

### 3.1 Input (输入框)

**功能定义 / Function Definition**
- 单行文本输入
- 支持多种输入类型
- 实时验证
- 前缀/后缀插槽

**属性规范 / Property Specifications**
```typescript
interface InputSchema {
  type: 'input';
  name: string;
  value?: string;
  placeholder?: string;
  
  // 输入类型
  inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  
  // 状态
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  
  // 验证
  validation?: ValidationRule[];
  error?: string;
  
  // 插槽
  prefix?: SchemaNode;              // 前缀 (图标、文本)
  suffix?: SchemaNode;              // 后缀
  
  // 行为
  onChange?: ActionSchema;
  onBlur?: ActionSchema;
  onFocus?: ActionSchema;
  
  // 样式
  size?: 'sm' | 'default' | 'lg';
  fullWidth?: boolean;
  className?: string;
}
```

**尺寸规范 / Size Specifications**
| Size | 高度 | 内边距 | 字号 |
|------|------|--------|------|
| sm | 32px | 8px 12px | 14px |
| default | 40px | 12px 16px | 16px |
| lg | 48px | 16px 20px | 18px |

**验证规范 / Validation Specifications**
```typescript
type ValidationRule = 
  | { type: 'required'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'pattern'; value: RegExp | string; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'url'; message?: string }
  | { type: 'custom'; validator: (value: string) => boolean | Promise<boolean>; message?: string };
```

**移动端适配 / Mobile Adaptation**
- 最小高度 48px
- `inputmode` 属性优化键盘
- 自动完成建议
- 支持语音输入

**可访问性 / Accessibility**
- `aria-label` 或关联 `<label>`
- `aria-invalid` 错误时
- `aria-describedby` 关联错误消息
- `autocomplete` 属性

### 3.2 Textarea (多行文本框)

**功能定义 / Function Definition**
- 多行文本输入
- 自动高度调整
- 字符计数
- Markdown 预览（可选）

**属性规范 / Property Specifications**
```typescript
interface TextareaSchema {
  type: 'textarea';
  name: string;
  value?: string;
  placeholder?: string;
  rows?: number;                    // 初始行数
  maxRows?: number;                 // 最大行数（自动增长）
  autoResize?: boolean;             // 自动调整高度
  maxLength?: number;               // 最大字符数
  showCount?: boolean;              // 显示字符计数
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  validation?: ValidationRule[];
  error?: string;
  onChange?: ActionSchema;
  className?: string;
}
```

### 3.3 Select (选择器)

**功能定义 / Function Definition**
- 下拉选择
- 支持搜索
- 支持多选
- 虚拟滚动（大数据量）

**属性规范 / Property Specifications**
```typescript
interface SelectSchema {
  type: 'select';
  name: string;
  value?: string | string[];
  placeholder?: string;
  options: SelectOption[];
  
  // 功能
  searchable?: boolean;             // 可搜索
  multiple?: boolean;               // 多选
  clearable?: boolean;              // 可清除
  
  // 数据
  loadOptions?: {                   // 异步加载选项
    api: string;
    searchParam?: string;
  };
  
  // 状态
  disabled?: boolean;
  required?: boolean;
  error?: string;
  
  // 行为
  onChange?: ActionSchema;
  
  // 样式
  size?: 'sm' | 'default' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: string;
  description?: string;             // 选项描述
  group?: string;                   // 分组名称
}
```

**搜索功能 / Search Functionality**
- 支持拼音搜索（中文）
- 高亮匹配项
- 防抖 300ms

**虚拟滚动 / Virtual Scrolling**
- 选项 > 100 时自动启用
- 每次渲染 20 项
- 滚动时动态加载

### 3.4 Checkbox (复选框)

**功能定义 / Function Definition**
- 布尔值选择
- 支持半选状态
- 可作为复选框组

**属性规范 / Property Specifications**
```typescript
interface CheckboxSchema {
  type: 'checkbox';
  name: string;
  label?: string | SchemaNode;
  checked?: boolean;
  indeterminate?: boolean;          // 半选状态
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onChange?: ActionSchema;
  className?: string;
}
```

**尺寸规范 / Size Specifications**
- 复选框: 20x20px
- 勾选标记: 14x14px
- 最小触摸区域: 44x44px

### 3.5 Radio (单选框)

**功能定义 / Function Definition**
- 单选按钮组
- 支持卡片式布局
- 键盘导航

**属性规范 / Property Specifications**
```typescript
interface RadioGroupSchema {
  type: 'radio-group';
  name: string;
  value?: string;
  options: RadioOption[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'card';
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onChange?: ActionSchema;
  className?: string;
}

interface RadioOption {
  label: string | SchemaNode;
  value: string;
  disabled?: boolean;
  icon?: string;
  description?: string;
}
```

### 3.6 Switch (开关)

**功能定义 / Function Definition**
- 二元状态切换
- 即时生效类操作
- 支持加载状态

**属性规范 / Property Specifications**
```typescript
interface SwitchSchema {
  type: 'switch';
  name: string;
  label?: string | SchemaNode;
  checked?: boolean;
  disabled?: boolean;
  loading?: boolean;                // 加载状态
  size?: 'sm' | 'default' | 'lg';
  onChange?: ActionSchema;
  className?: string;
}
```

**尺寸规范 / Size Specifications**
| Size | 宽度 | 高度 | 圆点大小 |
|------|------|------|----------|
| sm | 32px | 18px | 14px |
| default | 44px | 24px | 20px |
| lg | 56px | 32px | 28px |

### 3.7 Slider (滑块)

**功能定义 / Function Definition**
- 数值范围选择
- 支持单点和区间
- 实时显示当前值
- 步进控制

**属性规范 / Property Specifications**
```typescript
interface SliderSchema {
  type: 'slider';
  name: string;
  value?: number | [number, number]; // 单值或区间
  min: number;
  max: number;
  step?: number;                    // 步进值
  marks?: { [key: number]: string | SchemaNode }; // 刻度标记
  tooltip?: boolean | 'always';     // 提示显示
  disabled?: boolean;
  onChange?: ActionSchema;
  className?: string;
}
```

**移动端适配 / Mobile Adaptation**
- 滑块高度 48px
- 触摸区域 > 44px
- 支持触觉反馈

### 3.8 DatePicker (日期选择器)

**功能定义 / Function Definition**
- 日期/时间选择
- 支持日期范围
- 多种显示格式
- 本地化支持

**属性规范 / Property Specifications**
```typescript
interface DatePickerSchema {
  type: 'date-picker';
  name: string;
  value?: string | [string, string]; // ISO 8601 format
  mode?: 'single' | 'range' | 'multiple';
  format?: string;                  // e.g., 'YYYY-MM-DD'
  showTime?: boolean;               // 包含时间
  minDate?: string;
  maxDate?: string;
  disabledDates?: string[] | ((date: Date) => boolean);
  locale?: string;                  // 'zh-CN', 'en-US', etc.
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onChange?: ActionSchema;
  className?: string;
}
```

**日历面板功能 / Calendar Panel Features**
- 月份/年份快速切换
- 今天按钮
- 清除按钮
- 快捷选项（昨天、最近7天、本月等）
- 键盘导航

### 3.9 FileUpload (文件上传)

**功能定义 / Function Definition**
- 文件上传
- 拖拽上传
- 多文件上传
- 上传进度
- 文件预览

**属性规范 / Property Specifications**
```typescript
interface FileUploadSchema {
  type: 'file-upload';
  name: string;
  value?: FileMetadata[];
  
  // 限制
  accept?: string;                  // MIME types
  multiple?: boolean;
  maxSize?: number;                 // bytes
  maxFiles?: number;
  
  // 上传
  uploadUrl: string;
  uploadMethod?: 'POST' | 'PUT';
  uploadHeaders?: Record<string, string>;
  
  // 功能
  draggable?: boolean;              // 拖拽上传
  preview?: boolean;                // 文件预览
  removable?: boolean;              // 可删除
  
  // 状态
  disabled?: boolean;
  error?: string;
  
  // 事件
  onUploadStart?: ActionSchema;
  onUploadProgress?: ActionSchema;
  onUploadComplete?: ActionSchema;
  onUploadError?: ActionSchema;
  onChange?: ActionSchema;
  
  className?: string;
}

interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  thumbnailUrl?: string;
  uploadProgress?: number;          // 0-100
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}
```

**上传流程 / Upload Flow**
1. 选择文件 → 客户端验证
2. 显示预览 → 开始上传
3. 显示进度条 → 上传完成
4. 更新状态 → 触发回调

**移动端适配 / Mobile Adaptation**
- 支持相机拍照
- 支持相册选择
- 压缩图片上传
- 显示上传队列

### 3.10 Form (表单容器)

**功能定义 / Function Definition**
- 表单字段组织
- 统一验证
- 数据收集和提交
- 错误处理

**属性规范 / Property Specifications**
```typescript
interface FormSchema {
  type: 'form';
  fields: FormField[];
  layout?: 'vertical' | 'horizontal' | 'inline';
  columns?: number | { sm?: number; md?: number; lg?: number };
  
  // 数据
  initialValues?: Record<string, any>;
  
  // 提交
  onSubmit?: ActionSchema;
  submitText?: string;
  submitButton?: ButtonSchema;
  
  // 验证
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  
  // 样式
  spacing?: number;                 // 字段间距
  className?: string;
}

interface FormField {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  validation?: ValidationRule[];
  help?: string;                    // 帮助文本
  component: SchemaNode;            // 表单组件
  span?: number;                    // 占据列数
  dependencies?: string[];          // 依赖字段
  visibleWhen?: string;             // 显示条件表达式
}
```

**表单布局示例 / Form Layout Examples**

**垂直布局 (默认)**
```
[Label]
[Input]
[Help Text]

[Label]
[Input]
```

**水平布局**
```
[Label]  [Input        ]  [Help]
[Label]  [Input        ]  [Help]
```

**多列布局**
```
[Label]          [Label]
[Input]          [Input]

[Label]          [Label]
[Input]          [Input]
```

---

## 4. 数据展示组件 / Data Display Components

### 4.1 Table (表格)

**功能定义 / Function Definition**
- 结构化数据展示
- 排序、筛选、分页
- 行选择
- 自定义列渲染

**属性规范 / Property Specifications**
```typescript
interface TableSchema {
  type: 'table';
  columns: TableColumn[];
  data?: any[];
  dataSource?: string;              // API endpoint
  
  // 功能
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean | 'single' | 'multiple';
  expandable?: boolean;
  
  // 分页
  pagination?: {
    pageSize?: number;
    pageSizeOptions?: number[];
    showTotal?: boolean;
    showSizeChanger?: boolean;
  };
  
  // 样式
  size?: 'sm' | 'default' | 'lg';
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  
  // 事件
  onRowClick?: ActionSchema;
  onSelectionChange?: ActionSchema;
  onSortChange?: ActionSchema;
  onFilterChange?: ActionSchema;
  
  className?: string;
}

interface TableColumn {
  key: string;
  title: string | SchemaNode;
  dataIndex?: string;               // 数据字段路径
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'select' | 'date' | 'number';
  filterOptions?: SelectOption[];
  render?: SchemaNode;              // 自定义渲染
  ellipsis?: boolean;               // 超长省略
}
```

**交互规范 / Interaction Specifications**
- **排序**: 点击列头切换升序/降序/无序
- **筛选**: 列头下拉筛选器
- **行选择**: 复选框列
- **行展开**: 嵌套数据展开行
- **Hover**: 高亮当前行

**移动端适配 / Mobile Adaptation**
- 横向滚动表格
- 固定首列
- 卡片式展示（可选）
- 响应式隐藏次要列

### 4.2 List (列表)

**功能定义 / Function Definition**
- 垂直列表展示
- 支持虚拟滚动
- 分页或无限滚动
- 自定义列表项

**属性规范 / Property Specifications**
```typescript
interface ListSchema {
  type: 'list';
  items: any[] | { dataSource: string };
  renderItem: SchemaNode;           // 列表项模板
  
  // 功能
  virtual?: boolean;                // 虚拟滚动
  infinite?: boolean;               // 无限滚动
  
  // 分割线
  divided?: boolean;
  
  // 加载更多
  loadMore?: {
    text?: string;
    loading?: boolean;
    hasMore?: boolean;
    onLoadMore?: ActionSchema;
  };
  
  // 空状态
  empty?: SchemaNode;
  
  className?: string;
}

interface ListItem {
  id: string;
  avatar?: SchemaNode;
  title: string | SchemaNode;
  description?: string | SchemaNode;
  extra?: SchemaNode;               // 右侧额外内容
  actions?: SchemaNode[];
}
```

### 4.3 Badge (徽标)

**功能定义 / Function Definition**
- 状态标记
- 数字提示
- 圆点提示

**属性规范 / Property Specifications**
```typescript
interface BadgeSchema {
  type: 'badge';
  content?: string | number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'default' | 'lg';
  dot?: boolean;                    // 圆点模式
  max?: number;                     // 最大显示数字
  showZero?: boolean;               // 0 时是否显示
  children?: SchemaNode;            // 包裹的元素
  className?: string;
}
```

**视觉规范 / Visual Specifications**
| Variant | 背景色 | 文字色 | 使用场景 |
|---------|--------|--------|----------|
| default | neutral-200 | neutral-900 | 普通状态 |
| primary | primary-500 | white | 重要提示 |
| success | green-500 | white | 成功状态 |
| warning | orange-500 | white | 警告提示 |
| error | red-500 | white | 错误/未读 |
| info | blue-500 | white | 信息提示 |

### 4.4 Avatar (头像)

**功能定义 / Function Definition**
- 用户头像展示
- 支持图片、文字、图标
- 头像组

**属性规范 / Property Specifications**
```typescript
interface AvatarSchema {
  type: 'avatar';
  src?: string;                     // 图片 URL
  alt?: string;
  fallback?: string;                // 首字母或图标
  size?: number | 'sm' | 'default' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  badge?: BadgeSchema;              // 角标
  className?: string;
}
```

**尺寸预设 / Size Presets**
- sm: 32px
- default: 40px
- lg: 56px
- xl: 96px

### 4.5 Statistic (统计数值)

**功能定义 / Function Definition**
- 突出显示数据指标
- 支持前缀/后缀
- 趋势指示
- 动画计数

**属性规范 / Property Specifications**
```typescript
interface StatisticSchema {
  type: 'statistic';
  title: string | SchemaNode;
  value: number | string;
  prefix?: string | SchemaNode;
  suffix?: string | SchemaNode;
  precision?: number;               // 小数位数
  formatter?: (value: number) => string;
  
  // 趋势
  trend?: 'up' | 'down';
  trendValue?: string;
  trendColor?: 'success' | 'error';
  
  // 动画
  countUp?: boolean;                // 数字递增动画
  duration?: number;                // 动画时长
  
  className?: string;
}
```

### 4.6 Alert (警告提示)

**功能定义 / Function Definition**
- 页面级消息提示
- 支持关闭
- 操作按钮

**属性规范 / Property Specifications**
```typescript
interface AlertSchema {
  type: 'alert';
  title?: string | SchemaNode;
  description?: string | SchemaNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  icon?: string | boolean;          // 自定义或自动图标
  closable?: boolean;
  actions?: SchemaNode[];
  onClose?: ActionSchema;
  className?: string;
}
```

**视觉规范 / Visual Specifications**
| Variant | 背景色 | 边框色 | 图标 |
|---------|--------|--------|------|
| default | neutral-50 | neutral-200 | Info |
| success | green-50 | green-200 | CheckCircle |
| warning | orange-50 | orange-200 | AlertTriangle |
| error | red-50 | red-200 | XCircle |
| info | blue-50 | blue-200 | Info |

### 4.7 Timeline (时间轴)

**功能定义 / Function Definition**
- 时序信息展示
- 支持自定义节点
- 多种样式模式

**属性规范 / Property Specifications**
```typescript
interface TimelineSchema {
  type: 'timeline';
  items: TimelineEvent[];
  mode?: 'left' | 'right' | 'alternate';
  pending?: string | SchemaNode;    // 待完成项
  className?: string;
}

interface TimelineEvent {
  id: string;
  timestamp: string;                // ISO 8601
  title: string | SchemaNode;
  description?: string | SchemaNode;
  icon?: string | SchemaNode;
  color?: string;
  status?: 'pending' | 'active' | 'completed' | 'error';
}
```

---

## 5. 反馈组件 / Feedback Components

### 5.1 Toast (轻提示)

**功能定义 / Function Definition**
- 轻量级全局提示
- 自动消失
- 多个提示队列
- 操作按钮

**属性规范 / Property Specifications**
```typescript
interface ToastSchema {
  type: 'toast';
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  duration?: number;                // 自动关闭时长 (ms)
  closable?: boolean;
  action?: ButtonSchema;
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
}
```

**显示时长规范 / Duration Specifications**
- 纯文本: 2000ms
- 带标题: 3000ms
- 带操作: 4000ms
- 错误提示: 5000ms

**动画规范 / Animation Specifications**
- 进入: 从右侧滑入 + 淡入 (300ms)
- 退出: 向右滑出 + 淡出 (200ms)
- 多个提示: 堆叠显示，最多 3 个

### 5.2 Progress (进度条)

**功能定义 / Function Definition**
- 操作进度展示
- 线性和环形
- 分段进度

**属性规范 / Property Specifications**
```typescript
interface ProgressSchema {
  type: 'progress';
  value: number;                    // 0-100
  type?: 'linear' | 'circular';
  size?: 'sm' | 'default' | 'lg';
  color?: string;
  showLabel?: boolean;              // 显示百分比
  label?: string | ((value: number) => string);
  indeterminate?: boolean;          // 不确定进度
  className?: string;
}
```

**环形进度特殊属性 / Circular Progress Properties**
- strokeWidth?: number (线条宽度)
- diameter?: number (直径)

### 5.3 Spinner (加载指示器)

**功能定义 / Function Definition**
- 加载状态指示
- 多种视觉样式
- 可配置大小和颜色

**属性规范 / Property Specifications**
```typescript
interface SpinnerSchema {
  type: 'spinner';
  size?: number | 'sm' | 'default' | 'lg';
  color?: string;
  variant?: 'default' | 'dots' | 'pulse';
  label?: string;                   // 加载文字
  className?: string;
}
```

### 5.4 Skeleton (骨架屏)

**功能定义 / Function Definition**
- 内容加载占位
- 模拟真实布局
- 减少白屏时间

**属性规范 / Property Specifications**
```typescript
interface SkeletonSchema {
  type: 'skeleton';
  variant?: 'text' | 'circular' | 'rectangular';
  width?: number | string;
  height?: number | string;
  lines?: number;                   // text 模式行数
  animated?: boolean;               // 动画效果
  className?: string;
}
```

### 5.5 Empty (空状态)

**功能定义 / Function Definition**
- 无数据占位
- 引导用户操作
- 自定义图标和文案

**属性规范 / Property Specifications**
```typescript
interface EmptySchema {
  type: 'empty';
  image?: string | SchemaNode;      // 空状态图片
  title?: string;
  description?: string;
  actions?: SchemaNode[];           // 操作按钮
  className?: string;
}
```

---

## 6. 折叠组件 / Disclosure Components

### 6.1 Accordion (手风琴)

**功能定义 / Function Definition**
- 折叠面板
- 单个或多个展开
- 嵌套支持

**属性规范 / Property Specifications**
```typescript
interface AccordionSchema {
  type: 'accordion';
  items: AccordionItem[];
  type?: 'single' | 'multiple';     // 展开模式
  defaultValue?: string | string[];
  collapsible?: boolean;            // 可折叠（单模式）
  className?: string;
}

interface AccordionItem {
  value: string;
  trigger: string | SchemaNode;     // 触发器内容
  content: SchemaNode | SchemaNode[];
  disabled?: boolean;
  icon?: string;
}
```

**交互规范 / Interaction Specifications**
- 点击标题切换展开/折叠
- 动画过渡 300ms
- 键盘导航（上下箭头）

### 6.2 Collapsible (折叠面板)

**功能定义 / Function Definition**
- 单个内容折叠
- 独立控制
- 自定义触发器

**属性规范 / Property Specifications**
```typescript
interface CollapsibleSchema {
  type: 'collapsible';
  trigger: SchemaNode;              // 触发器
  content: SchemaNode | SchemaNode[];
  defaultOpen?: boolean;
  open?: boolean;                   // 受控模式
  onOpenChange?: ActionSchema;
  className?: string;
}
```

### 6.3 Toggle (切换组)

**功能定义 / Function Definition**
- 多个选项切换
- 类似按钮组
- 单选或多选

**属性规范 / Property Specifications**
```typescript
interface ToggleGroupSchema {
  type: 'toggle-group';
  type: 'single' | 'multiple';
  value?: string | string[];
  items: ToggleItem[];
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline';
  onChange?: ActionSchema;
  className?: string;
}

interface ToggleItem {
  value: string;
  label: string | SchemaNode;
  icon?: string;
  disabled?: boolean;
}
```

---

## 7. 浮层组件 / Overlay Components

### 7.1 Dialog (对话框)

**功能定义 / Function Definition**
- 模态对话框
- 表单/确认/详情
- 可拖拽（可选）
- 全屏支持

**属性规范 / Property Specifications**
```typescript
interface DialogSchema {
  type: 'dialog';
  open?: boolean;
  title?: string | SchemaNode;
  description?: string | SchemaNode;
  content: SchemaNode | SchemaNode[];
  footer?: SchemaNode | SchemaNode[];
  
  // 尺寸
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
  
  // 行为
  closable?: boolean;               // 显示关闭按钮
  closeOnEscape?: boolean;          // ESC 关闭
  closeOnOverlayClick?: boolean;    // 点击遮罩关闭
  draggable?: boolean;              // 可拖拽
  
  // 事件
  onClose?: ActionSchema;
  onConfirm?: ActionSchema;
  
  className?: string;
}
```

**尺寸规范 / Size Specifications**
| Size | 最大宽度 | 使用场景 |
|------|----------|----------|
| sm | 400px | 简单确认 |
| default | 600px | 常规表单 |
| lg | 800px | 复杂表单 |
| xl | 1000px | 详情展示 |
| full | 100vw | 全屏编辑 |

**移动端适配 / Mobile Adaptation**
- 自动全屏
- 底部弹出（可选）
- 支持手势下滑关闭

### 7.2 Sheet (抽屉)

**功能定义 / Function Definition**
- 侧边抽屉
- 四个方向
- 多层嵌套

**属性规范 / Property Specifications**
```typescript
interface SheetSchema {
  type: 'sheet';
  open?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
  title?: string | SchemaNode;
  description?: string | SchemaNode;
  content: SchemaNode | SchemaNode[];
  footer?: SchemaNode | SchemaNode[];
  
  // 尺寸
  size?: number | string;           // 宽度/高度
  
  // 行为
  closable?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  
  // 事件
  onClose?: ActionSchema;
  
  className?: string;
}
```

**默认尺寸 / Default Sizes**
- right/left: 400px (宽度)
- top/bottom: 60vh (高度)

### 7.3 Popover (气泡卡片)

**功能定义 / Function Definition**
- 轻量级弹出层
- 智能定位
- 鼠标悬停或点击触发

**属性规范 / Property Specifications**
```typescript
interface PopoverSchema {
  type: 'popover';
  trigger: SchemaNode;              // 触发元素
  content: SchemaNode | SchemaNode[];
  
  // 定位
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  offset?: number;                  // px
  
  // 触发方式
  triggerOn?: 'click' | 'hover' | 'focus';
  
  // 行为
  arrow?: boolean;                  // 箭头
  closeOnClickOutside?: boolean;
  
  className?: string;
}
```

### 7.4 Tooltip (工具提示)

**功能定义 / Function Definition**
- 简短说明文字
- 鼠标悬停显示
- 自动定位

**属性规范 / Property Specifications**
```typescript
interface TooltipSchema {
  type: 'tooltip';
  children: SchemaNode;             // 触发元素
  content: string | SchemaNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;                   // 延迟显示 (ms)
  maxWidth?: number | string;
  className?: string;
}
```

**显示时机 / Display Timing**
- 延迟: 500ms (鼠标悬停)
- 持续: 直到鼠标移开
- 动画: 淡入淡出 150ms

### 7.5 Dropdown Menu (下拉菜单)

**功能定义 / Function Definition**
- 下拉操作菜单
- 分组和分隔线
- 快捷键提示
- 子菜单

**属性规范 / Property Specifications**
```typescript
interface DropdownMenuSchema {
  type: 'dropdown-menu';
  trigger: SchemaNode;              // 触发按钮
  items: MenuItem[];
  
  // 定位
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  
  className?: string;
}

interface MenuItem {
  type?: 'item' | 'checkbox' | 'radio' | 'separator' | 'label' | 'sub';
  label?: string | SchemaNode;
  icon?: string;
  shortcut?: string;                // 快捷键提示
  disabled?: boolean;
  checked?: boolean;                // checkbox/radio
  items?: MenuItem[];               // 子菜单
  onClick?: ActionSchema;
}
```

---

## 8. 导航组件 / Navigation Components

### 8.1 Breadcrumb (面包屑)

**功能定义 / Function Definition**
- 层级导航路径
- 当前位置指示
- 支持图标

**属性规范 / Property Specifications**
```typescript
interface BreadcrumbSchema {
  type: 'breadcrumb';
  items: BreadcrumbItem[];
  separator?: string | SchemaNode;  // 分隔符
  className?: string;
}

interface BreadcrumbItem {
  label: string | SchemaNode;
  href?: string;
  icon?: string;
  onClick?: ActionSchema;
}
```

### 8.2 Pagination (分页)

**功能定义 / Function Definition**
- 页码导航
- 页容量选择
- 快速跳转

**属性规范 / Property Specifications**
```typescript
interface PaginationSchema {
  type: 'pagination';
  total: number;                    // 总条数
  page?: number;                    // 当前页
  pageSize?: number;                // 每页条数
  pageSizeOptions?: number[];       // 页容量选项
  
  // 功能
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;        // 快速跳转
  showTotal?: boolean | ((total: number, range: [number, number]) => string);
  
  // 简洁模式
  simple?: boolean;
  
  // 事件
  onChange?: ActionSchema;
  
  className?: string;
}
```

### 8.3 Sidebar (侧边栏)

**功能定义 / Function Definition**
- 应用导航菜单
- 多级菜单
- 折叠/展开
- 图标模式

**属性规范 / Property Specifications**
```typescript
interface SidebarSchema {
  type: 'sidebar';
  items: NavLink[];
  collapsed?: boolean;              // 折叠状态
  width?: number | string;          // 展开宽度
  collapsedWidth?: number | string; // 折叠宽度
  theme?: 'light' | 'dark';
  logo?: SchemaNode;
  footer?: SchemaNode;
  onCollapse?: ActionSchema;
  className?: string;
}

interface NavLink {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  active?: boolean;
  badge?: number | string;
  children?: NavLink[];             // 子菜单
  onClick?: ActionSchema;
}
```

### 8.4 HeaderBar (顶栏)

**功能定义 / Function Definition**
- 应用顶部导航
- Logo + 菜单 + 用户信息
- 固定或悬浮

**属性规范 / Property Specifications**
```typescript
interface HeaderBarSchema {
  type: 'header-bar';
  logo?: SchemaNode;
  title?: string | SchemaNode;
  nav?: SchemaNode[];               // 导航项
  actions?: SchemaNode[];           // 右侧操作
  sticky?: boolean;                 // 固定顶部
  height?: number | string;
  theme?: 'light' | 'dark';
  className?: string;
}
```

---

## 9. 复杂组件 / Complex Components

### 9.1 Dashboard (仪表板)

**功能定义 / Function Definition**
- 拖拽式仪表板
- 网格布局
- 响应式卡片
- 实时数据

**属性规范 / Property Specifications**
```typescript
interface DashboardSchema {
  type: 'dashboard';
  widgets: DashboardWidgetSchema[];
  layout?: DashboardWidgetLayout[];
  cols?: { lg?: number; md?: number; sm?: number };
  rowHeight?: number;
  editable?: boolean;               // 可编辑布局
  onLayoutChange?: ActionSchema;
  className?: string;
}

interface DashboardWidgetSchema {
  id: string;
  title?: string;
  type: string;                     // 组件类型
  config: any;                      // 组件配置
  refreshInterval?: number;         // 自动刷新 (ms)
}

interface DashboardWidgetLayout {
  i: string;                        // widget id
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}
```

### 9.2 Kanban (看板)

**功能定义 / Function Definition**
- 拖拽式看板
- 多列布局
- 卡片详情
- 虚拟滚动

**属性规范 / Property Specifications**
```typescript
interface KanbanSchema {
  type: 'kanban';
  columns: KanbanColumn[];
  onCardMove?: ActionSchema;
  onCardClick?: ActionSchema;
  className?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  cards: KanbanCard[];
  limit?: number;                   // 卡片数量限制
  collapsible?: boolean;
}

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  metadata?: Record<string, any>;
}
```

### 9.3 Calendar (日历视图)

**功能定义 / Function Definition**
- 月/周/日视图
- 事件展示
- 拖拽调整
- 时区支持

**属性规范 / Property Specifications**
```typescript
interface CalendarViewSchema {
  type: 'calendar-view';
  mode?: 'month' | 'week' | 'day' | 'agenda';
  events: CalendarEvent[];
  date?: string;                    // 当前日期
  timezone?: string;
  
  // 功能
  editable?: boolean;               // 可编辑
  selectable?: boolean;             // 可选择时间段
  
  // 事件
  onEventClick?: ActionSchema;
  onEventDrop?: ActionSchema;       // 拖拽事件
  onEventResize?: ActionSchema;     // 调整大小
  onSelectSlot?: ActionSchema;      // 选择时间段
  onViewChange?: ActionSchema;
  
  className?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;                    // ISO 8601
  end: string;
  allDay?: boolean;
  color?: string;
  backgroundColor?: string;
  metadata?: Record<string, any>;
}
```

### 9.4 Gantt (甘特图)

**功能定义 / Function Definition**
- 项目时间线
- 任务依赖
- 里程碑
- 进度追踪

**属性规范 / Property Specifications**
```typescript
interface GanttSchema {
  type: 'gantt';
  tasks: GanttTask[];
  dependencies?: GanttDependency[];
  
  // 视图配置
  viewMode?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate?: string;
  endDate?: string;
  
  // 功能
  editable?: boolean;
  showCriticalPath?: boolean;       // 显示关键路径
  
  // 事件
  onTaskClick?: ActionSchema;
  onTaskUpdate?: ActionSchema;
  onDependencyAdd?: ActionSchema;
  
  className?: string;
}

interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress?: number;                // 0-100
  type?: 'task' | 'milestone' | 'project';
  parent?: string;                  // 父任务 ID
  dependencies?: string[];          // 前置任务 IDs
  assignee?: string;
  color?: string;
}

interface GanttDependency {
  from: string;                     // 任务 ID
  to: string;                       // 任务 ID
  type?: 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';
}
```

### 9.5 Chatbot (聊天机器人)

**功能定义 / Function Definition**
- AI 对话界面
- 流式输出
- 代码高亮
- 文件上传

**属性规范 / Property Specifications**
```typescript
interface ChatbotSchema {
  type: 'chatbot';
  messages: ChatMessage[];
  
  // API配置
  apiEndpoint: string;
  apiHeaders?: Record<string, string>;
  
  // 功能
  streaming?: boolean;              // 流式响应
  fileUpload?: boolean;
  codeHighlight?: boolean;
  markdown?: boolean;
  
  // 样式
  avatar?: {
    user?: string;
    bot?: string;
  };
  placeholder?: string;
  height?: number | string;
  
  // 事件
  onSend?: ActionSchema;
  onClear?: ActionSchema;
  
  className?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  metadata?: {
    model?: string;
    tokens?: number;
    files?: FileMetadata[];
  };
}
```

---

## 10. 业务组件 / Business Components

### 10.1 ObjectGrid (对象网格)

**功能定义 / Function Definition**
- ObjectQL 数据网格
- CRUD 操作
- 高级筛选
- 批量操作

**属性规范 / Property Specifications**
```typescript
interface ObjectGridSchema {
  type: 'object-grid';
  objectName: string;               // ObjectQL 对象名
  columns: ListColumn[];
  
  // 数据源
  datasource?: string;
  filters?: AdvancedFilterCondition[];
  sort?: QuerySortConfig[];
  
  // 功能
  selectable?: boolean;
  searchable?: boolean;
  exportable?: boolean;
  importable?: boolean;
  
  // 工具栏
  toolbar?: {
    showCreate?: boolean;
    showDelete?: boolean;
    showExport?: boolean;
    showImport?: boolean;
    customActions?: ActionSchema[];
  };
  
  // 事件
  onRowClick?: ActionSchema;
  onSelectionChange?: ActionSchema;
  onCreate?: ActionSchema;
  onUpdate?: ActionSchema;
  onDelete?: ActionSchema;
  
  className?: string;
}

interface ListColumn {
  field: string;
  label?: string;
  type?: string;                    // 字段类型
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: SchemaNode;
}
```

### 10.2 ObjectForm (对象表单)

**功能定义 / Function Definition**
- ObjectQL 对象表单
- 字段类型映射
- 关联字段
- 表单验证

**属性规范 / Property Specifications**
```typescript
interface ObjectFormSchema {
  type: 'object-form';
  objectName: string;
  recordId?: string;                // 编辑时的记录ID
  fields?: string[];                // 显示字段列表
  layout?: 'vertical' | 'horizontal';
  columns?: number;
  
  // 功能
  readonly?: boolean;
  showLabel?: boolean;
  
  // 事件
  onSubmit?: ActionSchema;
  onCancel?: ActionSchema;
  onChange?: ActionSchema;
  
  className?: string;
}
```

### 10.3 ListView (列表视图)

**功能定义 / Function Definition**
- ObjectQL 列表视图
- 多种视图模式切换
- 自定义视图保存

**属性规范 / Property Specifications**
```typescript
interface ListViewSchema {
  type: 'list-view';
  objectName: string;
  viewId?: string;                  // 视图ID
  viewType?: 'grid' | 'list' | 'kanban' | 'calendar' | 'gantt';
  
  // 配置
  columns?: ListColumn[];
  filters?: AdvancedFilterCondition[];
  sort?: QuerySortConfig[];
  groupBy?: string[];
  
  // 视图切换
  viewSwitcher?: boolean;
  availableViews?: ViewType[];
  
  className?: string;
}
```

---

## 11. 插件组件 / Plugin Components

### 11.1 AG Grid (高级数据网格)

**功能定义 / Function Definition**
- 企业级数据网格
- 百万行数据
- 高级筛选
- Excel 导入导出

**属性规范 / Property Specifications**
```typescript
interface AGGridSchema {
  type: 'ag-grid';
  columns: AGGridColumn[];
  rowData?: any[];
  datasource?: string;
  
  // 功能
  enableRangeSelection?: boolean;
  enableCharts?: boolean;
  enablePivot?: boolean;
  enableGrouping?: boolean;
  masterDetail?: boolean;
  
  // 性能
  pagination?: boolean;
  paginationPageSize?: number;
  cacheBlockSize?: number;
  
  className?: string;
}

interface AGGridColumn {
  field: string;
  headerName?: string;
  type?: string;
  width?: number;
  pinned?: 'left' | 'right';
  pivot?: boolean;
  rowGroup?: boolean;
  aggFunc?: 'sum' | 'avg' | 'min' | 'max' | 'count';
  filter?: boolean | string;
  editable?: boolean;
}
```

### 11.2 Charts (图表)

**功能定义 / Function Definition**
- 多种图表类型
- 响应式
- 交互式
- 主题支持

**属性规范 / Property Specifications**
```typescript
interface ChartSchema {
  type: 'chart';
  chartType: ChartType;
  data: any[];
  
  // 配置
  xAxis?: {
    key: string;
    label?: string;
  };
  yAxis?: {
    label?: string;
  };
  series: ChartSeries[];
  
  // 样式
  colors?: string[];
  height?: number | string;
  
  // 交互
  interactive?: boolean;
  tooltip?: boolean;
  legend?: boolean;
  zoom?: boolean;
  
  className?: string;
}

type ChartType = 
  | 'line'
  | 'bar'
  | 'area'
  | 'pie'
  | 'donut'
  | 'scatter'
  | 'radar'
  | 'funnel'
  | 'gauge';

interface ChartSeries {
  key: string;
  name: string;
  type?: ChartType;                 // 混合图表
  color?: string;
}
```

### 11.3 Map (地图)

**功能定义 / Function Definition**
- 地图展示
- 标记点
- 路径规划
- 热力图

**属性规范 / Property Specifications**
```typescript
interface MapSchema {
  type: 'map';
  provider?: 'google' | 'mapbox' | 'amap' | 'bmap';
  center: [number, number];         // [lng, lat]
  zoom?: number;                    // 1-20
  
  // 功能
  markers?: MapMarker[];
  polylines?: MapPolyline[];
  polygons?: MapPolygon[];
  heatmap?: MapHeatmapPoint[];
  
  // 交互
  interactive?: boolean;
  showControls?: boolean;
  
  // 样式
  height?: number | string;
  theme?: 'light' | 'dark' | 'satellite';
  
  // 事件
  onMarkerClick?: ActionSchema;
  onMapClick?: ActionSchema;
  
  className?: string;
}

interface MapMarker {
  id: string;
  position: [number, number];
  icon?: string;
  label?: string;
  popup?: SchemaNode;
}
```

### 11.4 Rich Text Editor (富文本编辑器)

**功能定义 / Function Definition**
- 所见即所得编辑
- Markdown 支持
- 代码高亮
- 图片上传

**属性规范 / Property Specifications**
```typescript
interface EditorSchema {
  type: 'editor';
  value?: string;
  mode?: 'wysiwyg' | 'markdown' | 'code';
  
  // 功能
  toolbar?: string[];               // 工具栏按钮
  uploadUrl?: string;               // 图片上传
  maxLength?: number;
  
  // 样式
  height?: number | string;
  placeholder?: string;
  
  // 事件
  onChange?: ActionSchema;
  onSave?: ActionSchema;
  
  className?: string;
}
```

---

## 📱 移动端优先设计策略 / Mobile-First Design Strategy

### 1. 响应式断点策略 / Responsive Breakpoint Strategy

```typescript
const mobileStrategy = {
  // 断点定义 / Breakpoint Definition
  breakpoints: {
    xs: '0px',        // 小屏手机 Small phones (320px+)
    sm: '640px',      // 大屏手机 Large phones
    md: '768px',      // 平板 Tablets
    lg: '1024px',     // 笔记本 Laptops
    xl: '1280px',     // 桌面 Desktops
    '2xl': '1536px',  // 大屏 Large screens
  },
  
  // 组件行为调整 / Component Behavior Adjustments
  componentAdaptation: {
    // 表格 → 卡片式
    table: {
      xs: 'card-list',
      md: 'table',
    },
    // 侧边栏 → 抽屉
    sidebar: {
      xs: 'drawer',
      lg: 'sidebar',
    },
    // 多列 → 单列
    grid: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
    },
  },
};
```

### 2. 触摸交互优化 / Touch Interaction Optimization

**最小触摸目标 / Minimum Touch Target**
- 所有可交互元素: 最小 44x44px (iOS Human Interface Guidelines)
- 按钮默认高度: 48px (移动端)
- 链接最小行高: 44px
- 表单控件间距: 最小 16px

**手势支持 / Gesture Support**
```typescript
const gestures = {
  // 轻扫 / Swipe
  swipe: {
    direction: 'left' | 'right' | 'up' | 'down',
    threshold: 50,  // px
    velocity: 0.3,  // px/ms
    uses: [
      'Tabs 切换',
      'Sheet 关闭',
      'Drawer 打开/关闭',
      '列表项操作',
    ],
  },
  
  // 长按 / Long Press
  longPress: {
    duration: 500,  // ms
    uses: [
      '显示上下文菜单',
      '文本选择',
      '拖拽开始',
    ],
  },
  
  // 捏合 / Pinch
  pinch: {
    uses: [
      '图片缩放',
      '地图缩放',
    ],
  },
  
  // 下拉刷新 / Pull to Refresh
  pullToRefresh: {
    threshold: 80,  // px
    uses: [
      '列表刷新',
      '页面刷新',
    ],
  },
};
```

### 3. 移动端组件适配 / Mobile Component Adaptation

**导航模式 / Navigation Patterns**
```typescript
const mobileNavigation = {
  // 底部导航栏 / Bottom Navigation
  bottomNav: {
    items: 3-5,  // 最多5个
    iconSize: 24,
    height: 56,
    safe: 'env(safe-area-inset-bottom)',
  },
  
  // 汉堡菜单 / Hamburger Menu
  hamburger: {
    position: 'top-left',
    icon: 'Menu',
    drawer: {
      width: '80vw',
      maxWidth: 320,
    },
  },
  
  // 标签页 / Tabs
  tabs: {
    scrollable: true,
    minWidth: 90,
    centered: false,
  },
};
```

**表单优化 / Form Optimization**
```typescript
const mobileForm = {
  // 输入框优化 / Input Optimization
  input: {
    minHeight: 48,
    fontSize: 16,  // 防止 iOS 自动缩放
    autoComplete: true,
    inputMode: {
      email: 'email',
      tel: 'tel',
      number: 'numeric',
      url: 'url',
    },
  },
  
  // 选择器优化 / Picker Optimization
  select: {
    native: true,  // 使用原生选择器
    fullScreen: true,  // 全屏显示选项
  },
  
  // 日期选择器 / Date Picker
  datePicker: {
    native: true,  // iOS/Android 原生
    wheel: 'ios',  // 滚轮样式
  },
  
  // 布局 / Layout
  layout: {
    padding: 16,
    gap: 16,
    columns: 1,
  },
};
```

**数据展示优化 / Data Display Optimization**
```typescript
const mobileDataDisplay = {
  // 表格 → 卡片 / Table → Card
  table: {
    mode: 'card',
    showColumns: ['primary', 'secondary'],
    expandable: true,
    actions: 'swipe',  // 滑动显示操作
  },
  
  // 统计卡片 / Statistic Card
  statistic: {
    layout: 'vertical',
    fontSize: {
      value: 24,
      title: 14,
    },
  },
  
  // 列表 / List
  list: {
    itemHeight: 'auto',
    minHeight: 56,
    avatar: 40,
    virtualScroll: true,
  },
};
```

### 4. 性能优化策略 / Performance Optimization Strategy

**移动端性能目标 / Mobile Performance Targets**
```typescript
const performanceTargets = {
  // Core Web Vitals
  metrics: {
    FCP: 1.8,    // First Contentful Paint (s)
    LCP: 2.5,    // Largest Contentful Paint (s)
    FID: 100,    // First Input Delay (ms)
    CLS: 0.1,    // Cumulative Layout Shift
    TTI: 3.8,    // Time to Interactive (s)
  },
  
  // Bundle Size
  bundleSize: {
    initial: 150,  // KB (gzipped)
    route: 50,     // KB per route
    component: 20, // KB per lazy component
  },
  
  // Network
  network: {
    apiResponse: 800,  // ms (P95)
    imageLoad: 2000,   // ms
    timeout: 10000,    // ms
  },
};
```

**优化技术 / Optimization Techniques**
1. **代码分割 / Code Splitting**
   - 路由级分割
   - 组件级懒加载
   - 插件按需加载

2. **资源优化 / Asset Optimization**
   - WebP 图片 (JPEG fallback)
   - 响应式图片 (srcset)
   - SVG 精简
   - 字体子集化

3. **渲染优化 / Rendering Optimization**
   - 虚拟滚动 (列表 > 50 项)
   - 图片懒加载
   - 骨架屏
   - 防抖/节流

4. **缓存策略 / Caching Strategy**
   - Service Worker
   - IndexedDB (离线数据)
   - HTTP 缓存
   - 预加载关键资源

---

## 🚀 完整开发计划 / Complete Development Plan

### Phase 1: 基础组件完善 (2周 / 2 Weeks)

**目标 / Goals**
- 完成 50+ 基础组件开发
- 100% 移动端适配
- 100% 可访问性合规

**任务清单 / Task List**

**Week 1: 基础与布局组件 / Foundation & Layout**
- [ ] Text, Button, Icon, Image, Separator (1天)
- [ ] Container, Flex, Grid, Stack (1天)
- [ ] Card, Tabs, ScrollArea, AspectRatio (1.5天)
- [ ] 单元测试 + Storybook 文档 (1.5天)
- [ ] 可访问性测试 (WCAG AA) (1天)

**Week 2: 表单组件 / Form Components**
- [ ] Input, Textarea, Select, Combobox (2天)
- [ ] Checkbox, Radio, Switch, Slider (1.5天)
- [ ] DatePicker, FileUpload (1.5天)
- [ ] Form 容器 + 验证系统 (1天)
- [ ] 移动端测试 + 优化 (1天)

**交付物 / Deliverables**
- ✅ 25+ 组件完成
- ✅ 95%+ 测试覆盖率
- ✅ 完整 Storybook 文档
- ✅ 移动端适配验证报告

### Phase 2: 数据展示与反馈组件 (1.5周 / 1.5 Weeks)

**Week 3: 数据展示 / Data Display**
- [ ] Table (高级功能: 排序/筛选/分页) (2天)
- [ ] List (虚拟滚动) (1天)
- [ ] Badge, Avatar, Statistic (0.5天)
- [ ] Alert, Timeline (0.5天)
- [ ] Markdown 渲染器 (1天)

**Week 4 (Part 1): 反馈组件 / Feedback**
- [ ] Toast, Progress, Spinner (1天)
- [ ] Skeleton, Empty, Loading (1天)
- [ ] 移动端性能优化 (0.5天)

**交付物 / Deliverables**
- ✅ 12+ 组件完成
- ✅ 虚拟滚动性能测试通过
- ✅ Toast 队列管理优化

### Phase 3: 折叠与浮层组件 (1周 / 1 Week)

**Week 4 (Part 2): 折叠组件 / Disclosure**
- [ ] Accordion, Collapsible, Toggle (1天)

**Week 5: 浮层组件 / Overlay**
- [ ] Dialog, Sheet, Drawer (1.5天)
- [ ] Popover, Tooltip, HoverCard (1天)
- [ ] DropdownMenu, ContextMenu, Menubar (1.5天)
- [ ] 移动端手势支持 (1天)

**交付物 / Deliverables**
- ✅ 10+ 组件完成
- ✅ Z-index 管理系统
- ✅ 移动端手势测试通过

### Phase 4: 导航与复杂组件 (2周 / 2 Weeks)

**Week 6: 导航组件 / Navigation**
- [ ] Breadcrumb, Pagination (1天)
- [ ] Sidebar (折叠/展开/响应式) (1.5天)
- [ ] HeaderBar, NavigationMenu (1天)
- [ ] 路由集成 (React Router) (1.5天)

**Week 7: 复杂组件 / Complex Components**
- [ ] Dashboard (拖拽布局) (2天)
- [ ] Kanban (拖拽卡片) (1.5天)
- [ ] Calendar (多视图) (1.5天)
- [ ] Chatbot (流式输出) (1天)

**交付物 / Deliverables**
- ✅ 12+ 组件完成
- ✅ 拖拽系统优化
- ✅ 路由集成测试通过

### Phase 5: 业务与插件组件 (2周 / 2 Weeks)

**Week 8: 业务组件 / Business Components**
- [ ] ObjectGrid (ObjectQL 集成) (2天)
- [ ] ObjectForm (字段类型映射) (1.5天)
- [ ] ListView (视图切换) (1.5天)
- [ ] DetailView (详情页) (1天)

**Week 9: 插件组件 / Plugin Components**
- [ ] AG Grid 集成 (2天)
- [ ] Charts (Recharts 集成) (1.5天)
- [ ] Map (Mapbox 集成) (1天)
- [ ] Rich Text Editor (1.5天)

**交付物 / Deliverables**
- ✅ 8+ 组件完成
- ✅ ObjectQL 深度集成
- ✅ 插件懒加载优化

### Phase 6: 国际化与主题系统 (1周 / 1 Week)

**Week 10: i18n & Theme**
- [ ] i18n 系统 (10+ 语言) (2天)
- [ ] RTL 布局支持 (1天)
- [ ] 主题系统 (深色/浅色) (1.5天)
- [ ] 主题切换动画 (0.5天)

**交付物 / Deliverables**
- ✅ 10+ 语言翻译
- ✅ RTL 测试通过
- ✅ 主题系统文档

### Phase 7: 性能优化与测试 (1.5周 / 1.5 Weeks)

**Week 11: 性能优化 / Performance**
- [ ] Bundle 分析与优化 (1天)
- [ ] 渲染性能优化 (React.memo, useMemo) (1.5天)
- [ ] 网络请求优化 (缓存、批量) (1天)
- [ ] 移动端性能测试 (Lighthouse 90+) (1.5天)

**Week 12 (Part 1): 全面测试 / Comprehensive Testing**
- [ ] E2E 测试 (Playwright) (1.5天)
- [ ] 可访问性审计 (完整) (1天)

**交付物 / Deliverables**
- ✅ Lighthouse Score 95+
- ✅ Bundle Size < 150KB
- ✅ 85%+ E2E 覆盖率

### Phase 8: 文档与发布 (0.5周 / 0.5 Week)

**Week 12 (Part 2): 文档与发布 / Documentation & Release**
- [ ] API 文档完善 (1天)
- [ ] 使用指南 (10+ 案例) (1天)
- [ ] 视频教程录制 (0.5天)
- [ ] 发布 v1.0.0 (0.5天)

**交付物 / Deliverables**
- ✅ 200+ 页文档
- ✅ 50+ 示例代码
- ✅ 5+ 视频教程
- ✅ NPM 正式发布

---

## 📊 关键指标与验收标准 / Key Metrics & Acceptance Criteria

### 1. 技术指标 / Technical Metrics

| 指标 | 目标 | 当前 | 优先级 |
|------|------|------|--------|
| **测试覆盖率** | 85%+ | 62% | P0 |
| **TypeScript 严格模式** | 100% | 100% | ✅ |
| **Lighthouse 性能** | 95+ | - | P0 |
| **Bundle Size (gzipped)** | < 150KB | ~200KB | P1 |
| **首屏渲染 (FCP)** | < 500ms | ~800ms | P0 |
| **可访问性 (WCAG AA)** | 100% | ~70% | P0 |

### 2. 功能指标 / Functional Metrics

| 指标 | 目标 | 当前 | 优先级 |
|------|------|------|--------|
| **组件数量** | 50+ | 35+ | P1 |
| **移动端适配** | 100% | ~60% | P0 |
| **国际化语言** | 10+ | 0 | P0 |
| **主题支持** | 深色/浅色 | 部分 | P1 |
| **ObjectStack 规范对齐** | 100% | ~70% | P1 |

### 3. 质量指标 / Quality Metrics

| 指标 | 目标 | 验收标准 |
|------|------|----------|
| **文档完整性** | 100% | 每个组件有完整 API 文档 + 示例 |
| **Storybook 覆盖** | 100% | 所有组件有交互式示例 |
| **浏览器兼容性** | 95%+ | Chrome, Safari, Firefox, Edge (最新2个版本) |
| **无障碍测试** | WCAG 2.1 AA | 通过 axe, WAVE 工具检测 |
| **性能基准** | 通过 | Lighthouse CI 集成 |

### 4. 用户体验指标 / UX Metrics

| 指标 | 目标 | 测量方法 |
|------|------|----------|
| **学习曲线** | < 2小时 | 新手完成首个组件使用 |
| **开发效率** | 50%+ 提升 | vs 传统 React 手写 |
| **视觉一致性** | 100% | 设计系统审查 |
| **交互流畅度** | 60 FPS | 性能监控 |

---

## 🎯 成功标准 / Success Criteria

### MVP 发布标准 (v1.0.0)

**必须完成 (Must Have)**
- ✅ 50+ 基础组件完整实现
- ✅ 100% 移动端响应式适配
- ✅ 100% WCAG 2.1 AA 合规
- ✅ 10+ 语言国际化支持
- ✅ 深色/浅色主题切换
- ✅ 完整 TypeScript 类型定义
- ✅ 85%+ 测试覆盖率
- ✅ 完整 API 文档
- ✅ Lighthouse Score 95+

**应该完成 (Should Have)**
- ⚠️ 10+ 业务组件 (ObjectGrid, ObjectForm, etc.)
- ⚠️ 5+ 插件组件 (Charts, Map, Editor, etc.)
- ⚠️ Storybook 交互式文档
- ⚠️ E2E 测试套件
- ⚠️ 性能监控仪表板

**可以延后 (Nice to Have)**
- ⏳ AI 辅助组件配置
- ⏳ 可视化设计器
- ⏳ 组件市场
- ⏳ 高级动画系统

---

## 📚 附录 / Appendix

### A. 设计资源 / Design Resources

**设计系统参考 / Design System References**
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Material Design 3](https://m3.material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

**图标库 / Icon Libraries**
- [Lucide Icons](https://lucide.dev/) (主要)
- [Heroicons](https://heroicons.com/) (备选)

**字体 / Fonts**
- [Inter](https://rsms.me/inter/) (UI 字体)
- [Fira Code](https://github.com/tonsky/FiraCode) (代码字体)

### B. 技术栈 / Technology Stack

```typescript
const techStack = {
  // 核心 / Core
  framework: 'React 18+',
  language: 'TypeScript 5.0+',
  styling: 'Tailwind CSS 3.0+',
  
  // UI 基础 / UI Primitives
  primitives: 'Radix UI',
  icons: 'Lucide React',
  
  // 状态管理 / State Management
  global: 'Zustand',
  local: 'React Context + Hooks',
  
  // 表单 / Forms
  validation: 'Zod',
  formManagement: 'React Hook Form',
  
  // 数据获取 / Data Fetching
  client: 'TanStack Query (React Query)',
  
  // 路由 / Routing
  router: 'React Router v6',
  
  // 拖拽 / Drag & Drop
  dnd: '@dnd-kit',
  
  // 日期 / Date
  dateLib: 'date-fns',
  
  // 测试 / Testing
  unit: 'Vitest',
  component: 'React Testing Library',
  e2e: 'Playwright',
  a11y: 'axe-core',
  
  // 构建 / Build
  bundler: 'Vite',
  monorepo: 'Turbo + pnpm',
  
  // 文档 / Documentation
  docs: 'Storybook 7+',
  
  // CI/CD
  ci: 'GitHub Actions',
  deployment: 'Vercel / Netlify',
};
```

### C. 编码规范 / Coding Standards

**命名约定 / Naming Conventions**
```typescript
// 组件名: PascalCase
export const ButtonComponent = () => { };

// 文件名: kebab-case
// button-component.tsx

// 接口/类型: PascalCase + Schema/Props 后缀
interface ButtonSchema { }
interface ButtonProps { }

// 常量: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// 函数: camelCase
const handleClick = () => { };

// CSS类: kebab-case (Tailwind)
className="btn-primary"
```

**文件结构 / File Structure**
```
packages/components/src/
├── renderers/
│   ├── form/
│   │   ├── button.tsx          # 组件实现
│   │   ├── button.test.tsx     # 单元测试
│   │   └── button.stories.tsx  # Storybook
│   ├── layout/
│   └── ...
├── ui/                          # Shadcn UI 基础组件
├── hooks/                       # 共享 Hooks
├── lib/                         # 工具函数
└── index.ts                     # 导出
```

**组件模板 / Component Template**
```typescript
/**
 * Button Component
 * 
 * A versatile button component supporting multiple variants,
 * sizes, and states.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { ButtonSchema } from '@object-ui/types';

// 1. 样式定义
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        default: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// 2. Props 接口
export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// 3. 组件实现
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

// 4. Schema Renderer
export const ButtonRenderer: React.FC<{ schema: ButtonSchema }> = ({ 
  schema 
}) => {
  return (
    <Button
      variant={schema.variant}
      size={schema.size}
      disabled={schema.disabled}
      onClick={() => {/* handle action */}}
    >
      {schema.text}
    </Button>
  );
};
```

---

## 📝 总结 / Conclusion

### 设计愿景 / Design Vision

ObjectUI 致力于成为**全球最优秀的企业管理软件界面框架**，通过以下核心优势实现这一目标：

1. **极致体验 / Exceptional Experience**
   - 像素级完美的视觉设计
   - 流畅自然的交互动画
   - 100% 可访问性合规
   - 深色/浅色主题无缝切换

2. **移动优先 / Mobile-First**
   - 所有组件原生响应式
   - 手势交互全面支持
   - 性能优化（< 500ms FCP）
   - PWA 就绪

3. **开发者友好 / Developer-Friendly**
   - 完整 TypeScript 类型
   - 零学习曲线
   - 丰富示例文档
   - Storybook 交互演示

4. **企业级 / Enterprise-Grade**
   - ObjectStack 深度集成
   - 高级数据组件
   - 国际化（10+ 语言）
   - 安全合规

### 关键里程碑 / Key Milestones

| 时间点 | 版本 | 里程碑 | 核心成果 |
|--------|------|--------|----------|
| Week 4 | v0.5.0 | 基础组件完成 | 50+ 组件, 移动适配 |
| Week 8 | v0.8.0 | 业务组件完成 | ObjectQL 集成 |
| Week 10 | v0.9.0 | 国际化完成 | 10+ 语言, RTL |
| Week 12 | v1.0.0 | 正式发布 | 全功能, 文档完整 |

### 下一步行动 / Next Actions

**立即启动 (本周) / Immediate Start (This Week)**
1. ✅ 组建核心团队 (4-6人)
2. ✅ 设置开发环境
3. ✅ 创建项目看板 (GitHub Projects)
4. ✅ 开始 Phase 1 开发

**短期目标 (1个月) / Short-term (1 Month)**
- 完成所有基础组件
- 100% 移动端适配
- 建立 CI/CD 流水线
- 发布 Alpha 版本

**中期目标 (3个月) / Mid-term (3 Months)**
- 完成所有业务组件
- 国际化系统上线
- 发布 v1.0.0
- 社区推广启动

**长期目标 (6-12个月) / Long-term (6-12 Months)**
- 插件生态建设
- 可视化设计器
- AI 辅助功能
- 全球市场拓展

---

## 🤝 贡献与反馈 / Contribution & Feedback

### 如何贡献 / How to Contribute

本设计文档是开放的，欢迎社区贡献：

1. **提出建议**: 在 GitHub Issues 创建 Feature Request
2. **修正错误**: 提交 Pull Request
3. **分享案例**: 在 Discussions 分享使用案例
4. **翻译文档**: 帮助翻译成其他语言

### 联系我们 / Contact Us

- **GitHub**: https://github.com/objectstack-ai/objectui
- **Email**: hello@objectui.org
- **Discord**: https://discord.gg/objectui
- **Twitter**: @objectui

---

**文档版本历史 / Document Version History**

- v2.0 - 2026/02/03 - 完整功能设计文档
- v1.0 - 2025/12/01 - 初始版本

**下次更新 / Next Update**: 2026/03/01 (Phase 1 完成后)

---

<div align="center">

**让我们一起打造全球最优秀的企业管理软件界面框架！**  
**Let's build the world's best enterprise management software UI framework together!**

**Built with ❤️ by the ObjectUI Team**

</div>
