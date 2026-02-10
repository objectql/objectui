# ObjectStack Console 全流程开发方案

## 基于 @objectstack/client + better-auth 的完整评估

> **编写日期：** 2026 年 2 月 10 日  
> **适用版本：** @objectstack/client ^2.0.1 · @objectstack/spec ^2.0.1 · ObjectUI v0.5.x  
> **目标：** 评估并规划从登录到使用的 ObjectStack Console 完整开发方案

---

## 1. 现状扫描

### 1.1 已具备的能力

| 能力 | 包 / 文件 | 成熟度 |
|------|-----------|--------|
| **数据 CRUD** | `@object-ui/data-objectstack` (ObjectStackAdapter) | ✅ 生产就绪 |
| **元数据驱动 UI** | `@object-ui/react` (SchemaRendererProvider) | ✅ 生产就绪 |
| **列表 / 表格** | `@object-ui/plugin-grid`, `plugin-aggrid` | ✅ 生产就绪 |
| **表单系统** | `@object-ui/plugin-form` (6 种变体) | ✅ 生产就绪 |
| **仪表盘** | `@object-ui/plugin-dashboard` | ✅ 生产就绪 |
| **看板 / 日历 / 甘特** | `plugin-kanban`, `plugin-calendar`, `plugin-gantt` | ✅ 生产就绪 |
| **布局系统** | `@object-ui/layout` (AppShell, Sidebar, Header) | ✅ 生产就绪 |
| **权限系统** | `@object-ui/permissions` (RBAC, 字段/行级) | ✅ 生产就绪 |
| **多租户** | `@object-ui/tenant` (Provider, Guard, ScopedQuery) | ✅ 生产就绪 |
| **国际化** | `@object-ui/i18n` (10+ 语言, RTL) | ✅ 生产就绪 |
| **路由** | `react-router-dom` v7 (多应用路由) | ✅ 生产就绪 |
| **表达式引擎** | `@object-ui/core` (ExpressionEvaluator) | ✅ 生产就绪 |
| **主题系统** | Theme Provider (深色模式, CSS 变量) | ✅ 生产就绪 |
| **工作流** | `@object-ui/plugin-workflow` | ✅ 生产就绪 |
| **AI 集成** | `@object-ui/plugin-ai` | ✅ 生产就绪 |
| **报表导出** | `@object-ui/plugin-report` (PDF/Excel/CSV) | ✅ 生产就绪 |
| **命令面板** | `CommandPalette` 组件 | ✅ 生产就绪 |
| **连接状态监控** | `ConnectionStatus` 组件 | ✅ 生产就绪 |
| **错误边界** | `ErrorBoundary` 组件 | ✅ 生产就绪 |

### 1.2 缺失能力（认证与会话相关）

| 缺失能力 | 当前状态 | 优先级 |
|----------|---------|--------|
| **登录页面** | ❌ 无 — 硬编码用户 `{ name: 'John Doe', role: 'admin' }` | P0 |
| **会话管理** | ❌ 无 — 无 token 刷新/过期处理 | P0 |
| **认证上下文** | ❌ 无 — `ExpressionProvider` 接受手动传入的 user 对象 | P0 |
| **路由守卫** | ❌ 无 — 所有路由公开访问 | P0 |
| **注册流程** | ❌ 无 | P1 |
| **密码重置** | ❌ 无 | P1 |
| **用户资料页** | ❌ 无 | P1 |
| **OAuth 社交登录** | ❌ 无 | P2 |
| **组织管理** | ❌ 无 — 缺少 sys_user/sys_org/sys_role 系统对象 UI | P1 |
| **审计日志** | ❌ 无 — 缺少 sys_audit_log UI | P2 |
| **Token 注入到 DataSource** | ⚠️ 部分 — `ObjectStackAdapter` 构造器接受 `token` 参数但未动态更新 | P0 |

---

## 2. 技术评估

### 2.1 @objectstack/client 评估

**版本：** ^2.0.1

**已验证能力：**

```typescript
// 构造器 — 支持 token 和自定义 fetch
new ObjectStackClient({
  baseUrl: string;
  token?: string;                    // ✅ Token 认证
  fetch?: (input, init) => Promise;  // ✅ 自定义请求拦截
});

// 数据 API
client.data.find(objectName, query)   // ✅ 查询
client.data.get(objectName, id)       // ✅ 单条获取
client.data.create(objectName, data)  // ✅ 创建
client.data.update(objectName, id, d) // ✅ 更新
client.data.delete(objectName, id)    // ✅ 删除

// 元数据 API
client.meta.getObject(objectName)     // ✅ 获取对象定义
client.meta.getItem(key)              // ✅ 获取配置项

// 连接管理
client.connect()                      // ✅ 建立连接
```

**认证集成方式：**

| 方式 | 说明 | 推荐度 |
|------|------|--------|
| `token` 参数 | 构造时传入静态 token | ⭐⭐ 适合服务端 |
| `fetch` 拦截 | 自定义 fetch 注入 Authorization header | ⭐⭐⭐⭐⭐ 推荐 — 支持动态 token |
| 手动 header | 每次请求手动附加 | ⭐ 不推荐 |

**推荐认证集成策略：** 通过自定义 `fetch` 包装器，从 better-auth session 中动态获取 token 并注入到每个请求的 Authorization header 中。

```typescript
// 推荐模式
const adapter = new ObjectStackAdapter({
  baseUrl: '/api/v1',
  fetch: async (input, init) => {
    const session = await authClient.getSession();
    const headers = new Headers(init?.headers);
    if (session?.token) {
      headers.set('Authorization', `Bearer ${session.token}`);
    }
    return fetch(input, { ...init, headers });
  },
});
```

**评估结论：** ✅ @objectstack/client **完全满足** Console 数据层需求。通过自定义 `fetch` 可无缝对接任何认证系统。

### 2.2 better-auth 评估

**better-auth** 是一个现代化的 TypeScript-first 认证框架，为全栈 JavaScript/TypeScript 应用提供开箱即用的认证解决方案。

**核心能力：**

| 特性 | 支持情况 | Console 需要 |
|------|---------|-------------|
| 邮箱/密码登录 | ✅ 内置 | ✅ 必需 |
| OAuth/社交登录 | ✅ 插件 (GitHub, Google, etc.) | ✅ 推荐 |
| Session 管理 | ✅ 内置 (Cookie/JWT) | ✅ 必需 |
| Token 刷新 | ✅ 内置 | ✅ 必需 |
| 多租户 | ✅ 插件 (organization) | ✅ 必需 |
| RBAC | ✅ 插件 (access control) | ✅ 必需 |
| 双因子认证 | ✅ 插件 (two-factor) | ⬜ 可选 |
| 密码重置 | ✅ 内置 | ✅ 必需 |
| 邮箱验证 | ✅ 内置 | ✅ 推荐 |
| React 客户端 | ✅ `@better-auth/react` | ✅ 必需 |
| 数据库适配 | ✅ 多种 (Prisma, Drizzle, etc.) | ✅ 必需 |
| 自定义 API 路由 | ✅ 支持 | ✅ 必需 |

**与 ObjectStack 生态集成优势：**

1. **Session → Token 桥接**：better-auth session 可直接提供 JWT token 给 @objectstack/client
2. **Organization 插件** → 映射到 `@object-ui/tenant` 多租户体系
3. **Access Control 插件** → 映射到 `@object-ui/permissions` RBAC 体系
4. **React Hooks** → 与 ObjectUI React 组件模式一致

**评估结论：** ✅ better-auth **非常适合** 作为 Console 的认证层。它的 TypeScript-first 设计、插件体系和 React 集成与 ObjectUI 架构高度匹配。

---

## 3. 完整功能 Gap Analysis

### 可开发性评估：从登录到使用的所有功能

```
┌──────────────────────────────────────────────────────┐
│                  登录 → 使用 全流程                     │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────┐   ┌─────────┐   ┌─────────────────┐   │
│  │ 登录    │──▷│ 会话    │──▷│ 数据层 Token 注入 │   │
│  │ 页面    │   │ 建立    │   │ (fetch 拦截器)    │   │
│  └────┬────┘   └────┬────┘   └────────┬─────────┘   │
│       │             │                 │              │
│  better-auth   better-auth    @objectstack/client    │
│  + React UI    session         fetch wrapper         │
│       │             │                 │              │
│       ▼             ▼                 ▼              │
│  ┌─────────┐   ┌─────────┐   ┌─────────────────┐   │
│  │ 路由    │──▷│ 权限    │──▷│ 业务功能          │   │
│  │ 守卫    │   │ 加载    │   │ (CRUD/Dashboard)  │   │
│  └────┬────┘   └────┬────┘   └────────┬─────────┘   │
│       │             │                 │              │
│  AuthGuard     permissions     现有 Console 组件     │
│  组件          + tenant               │              │
│       │             │                 │              │
│       ▼             ▼                 ▼              │
│       ✅            ✅               ✅              │
│    可实现          已有             已完成            │
└──────────────────────────────────────────────────────┘
```

### 功能完整性矩阵

| 功能模块 | 现有组件 | 需新增 | 技术方案 | 工作量 |
|---------|---------|--------|---------|--------|
| **登录页** | 无 | LoginPage 组件 | better-auth `signIn.email()` + Shadcn Form | 3 天 |
| **注册页** | 无 | RegisterPage 组件 | better-auth `signUp.email()` + Shadcn Form | 2 天 |
| **密码重置** | 无 | ForgotPassword 组件 | better-auth `forgetPassword()` | 2 天 |
| **Auth 上下文** | ExpressionProvider (手动) | AuthProvider 组件 | better-auth `useSession()` + React Context | 3 天 |
| **路由守卫** | 无 | AuthGuard 组件 | React Router loader + session 检查 | 2 天 |
| **Token 注入** | ObjectStackAdapter (静态) | 动态 fetch 拦截器 | 自定义 fetch 包装 better-auth session | 1 天 |
| **会话续期** | 无 | 自动续期逻辑 | better-auth 内置 session refresh | 1 天 |
| **用户资料页** | 无 | ProfilePage 组件 | better-auth `useSession()` + ObjectForm | 2 天 |
| **用户管理** | plugin-grid/form (通用) | sys_user 对象定义 | 现有 CRUD 组件 + sys_user schema | 3 天 |
| **组织管理** | tenant 包 (Provider/Guard) | sys_org UI + 组织切换器 | better-auth organization 插件 + tenant 包 | 3 天 |
| **角色管理** | permissions 包 (evaluator) | sys_role UI + 角色分配 | 现有 CRUD + permissions 评估器 | 3 天 |
| **审计日志** | 无 | sys_audit_log 查看器 | 现有 plugin-grid + 只读模式 | 2 天 |
| **RBAC 集成** | permissions 包 (完整) | 仅需连接真实数据 | PermissionProvider 注入真实角色 | 1 天 |
| **多租户集成** | tenant 包 (完整) | 仅需连接真实数据 | TenantProvider 注入真实租户 | 1 天 |

**总计：约 29 个工作日（~6 周，1-2 人）**

---

## 4. 架构方案

### 4.1 新增包：`@object-ui/auth`

```
packages/auth/
├── src/
│   ├── index.ts                  # 公开 API
│   ├── AuthProvider.tsx          # 认证上下文 Provider
│   ├── useAuth.ts                # 认证 Hook
│   ├── AuthGuard.tsx             # 路由守卫组件
│   ├── LoginForm.tsx             # 登录表单 (Shadcn)
│   ├── RegisterForm.tsx          # 注册表单 (Shadcn)
│   ├── ForgotPasswordForm.tsx    # 密码重置表单
│   ├── UserMenu.tsx              # 用户下拉菜单
│   ├── createAuthClient.ts       # better-auth 客户端工厂
│   └── types.ts                  # Auth 类型定义
├── package.json
└── tsconfig.json
```

**核心 API 设计：**

```typescript
// --- AuthProvider ---
<AuthProvider
  authUrl="/api/auth"           // better-auth 服务端点
  onAuthStateChange={callback}  // 认证状态变更回调
  redirectTo="/login"           // 未认证重定向
>
  <App />
</AuthProvider>

// --- useAuth Hook ---
const {
  user,           // 当前用户 { id, name, email, role, image }
  session,        // 会话信息 { token, expiresAt }
  isAuthenticated,// boolean
  isLoading,      // boolean
  signIn,         // (email, password) => Promise
  signUp,         // (name, email, password) => Promise
  signOut,        // () => Promise
  updateUser,     // (data) => Promise
} = useAuth();

// --- AuthGuard ---
<AuthGuard
  fallback={<LoginPage />}        // 未认证时展示
  requiredRoles={['admin']}       // 可选：角色要求
  requiredPermissions={['read']}  // 可选：权限要求
>
  <ProtectedContent />
</AuthGuard>

// --- 与 ObjectStackAdapter 集成 ---
function createAuthenticatedAdapter(authClient) {
  return new ObjectStackAdapter({
    baseUrl: '/api/v1',
    fetch: async (input, init) => {
      const session = await authClient.getSession();
      const headers = new Headers(init?.headers);
      if (session?.token) {
        headers.set('Authorization', `Bearer ${session.token}`);
      }
      return fetch(input, { ...init, headers });
    },
  });
}
```

### 4.2 Console 改造方案

```diff
  // apps/console/src/App.tsx

+ import { AuthProvider, AuthGuard, useAuth } from '@object-ui/auth';
  import { ThemeProvider } from './components/theme-provider';

  export function App() {
    return (
      <ThemeProvider defaultTheme="system" storageKey="object-ui-theme">
+       <AuthProvider authUrl="/api/auth">
          <BrowserRouter basename="/">
            <Routes>
+             <Route path="/login" element={<LoginPage />} />
+             <Route path="/register" element={<RegisterPage />} />
+             <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/apps/:appName/*" element={
+               <AuthGuard fallback={<Navigate to="/login" />}>
                  <AppContent />
+               </AuthGuard>
              } />
              <Route path="/" element={<RootRedirect />} />
            </Routes>
          </BrowserRouter>
+       </AuthProvider>
      </ThemeProvider>
    );
  }

  // apps/console/src/App.tsx — AppContent 改造
  export function AppContent() {
-   const expressionUser = { name: 'John Doe', email: 'admin@example.com', role: 'admin' };
+   const { user, session } = useAuth();
+   const expressionUser = {
+     name: user.name,
+     email: user.email,
+     role: user.role
+   };

    // DataSource 现在带认证
+   const adapter = createAuthenticatedAdapter(authClient);

    return (
-     <ExpressionProvider user={expressionUser} app={activeApp} data={{}}>
+     <ExpressionProvider user={expressionUser} app={activeApp} data={{}}>
+       <PermissionProvider user={user} roles={user.roles}>
+         <TenantProvider tenant={session.tenant}>
            <ConsoleLayout ... />
+         </TenantProvider>
+       </PermissionProvider>
      </ExpressionProvider>
    );
  }
```

### 4.3 集成层次图

```
┌─────────────────────────────────────────────────────────┐
│                    Console App                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │               AuthProvider                        │   │
│  │  ┌──────────────────────────────────────────┐    │   │
│  │  │           PermissionProvider               │    │   │
│  │  │  ┌──────────────────────────────────┐     │    │   │
│  │  │  │         TenantProvider             │     │    │   │
│  │  │  │  ┌──────────────────────────┐     │     │    │   │
│  │  │  │  │     ExpressionProvider     │     │     │    │   │
│  │  │  │  │  ┌──────────────────┐    │     │     │    │   │
│  │  │  │  │  │  SchemaRenderer   │    │     │     │    │   │
│  │  │  │  │  │  (ConsoleLayout)  │    │     │     │    │   │
│  │  │  │  │  └──────────────────┘    │     │     │    │   │
│  │  │  │  └──────────────────────────┘     │     │    │   │
│  │  │  └──────────────────────────────────┘     │    │   │
│  │  └──────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │        ObjectStackAdapter (认证 fetch)             │   │
│  │              ↓ Bearer Token                        │   │
│  │     @objectstack/client → ObjectStack Server       │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 5. 实施计划

### Phase 1：认证基础（Week 1-2）

| 任务 | 描述 | 交付物 |
|------|------|--------|
| 1.1 创建 `@object-ui/auth` 包 | 包骨架、TypeScript 配置、依赖声明 | 包目录结构 |
| 1.2 集成 better-auth 客户端 | `createAuthClient()` 工厂函数 | `createAuthClient.ts` |
| 1.3 实现 AuthProvider | React Context + useSession 集成 | `AuthProvider.tsx` |
| 1.4 实现 useAuth Hook | 封装 better-auth React hooks | `useAuth.ts` |
| 1.5 实现 AuthGuard | 路由保护组件 + 重定向逻辑 | `AuthGuard.tsx` |
| 1.6 实现 LoginForm | Shadcn UI 登录表单 | `LoginForm.tsx` |
| 1.7 单元测试 | Auth 包核心逻辑测试 | `*.test.ts` |

### Phase 2：Console 集成（Week 3-4）

| 任务 | 描述 | 交付物 |
|------|------|--------|
| 2.1 Console 路由改造 | 添加 /login, /register 路由 + AuthGuard | `App.tsx` 更新 |
| 2.2 认证 DataSource | 自定义 fetch 注入 Bearer token | `dataSource.ts` 更新 |
| 2.3 用户上下文串联 | AuthProvider → ExpressionProvider → PermissionProvider | Provider 层级调整 |
| 2.4 用户菜单 | Header 右侧用户头像 + 下拉菜单 | `UserMenu.tsx` |
| 2.5 登录/注册页面 | 完整 UI 页面（使用 auth 包组件） | `LoginPage.tsx`, `RegisterPage.tsx` |
| 2.6 密码重置流程 | 忘记密码 → 发送邮件 → 重置 | `ForgotPasswordPage.tsx` |
| 2.7 集成测试 | 登录→CRUD→登出完整流程 | E2E 测试 |

### Phase 3：系统管理（Week 5-6）

| 任务 | 描述 | 交付物 |
|------|------|--------|
| 3.1 系统对象定义 | sys_user, sys_org, sys_role, sys_permission schema | `objectstack.config.ts` 更新 |
| 3.2 用户管理页 | 用户列表 + CRUD（复用 plugin-grid + plugin-form） | 用户管理 UI |
| 3.3 组织管理页 | 组织树 + 成员管理（复用 plugin-grid） | 组织管理 UI |
| 3.4 角色管理页 | 角色列表 + 权限分配矩阵 | 角色管理 UI |
| 3.5 用户资料页 | 个人信息编辑 + 头像上传 + 密码修改 | ProfilePage |
| 3.6 审计日志 | 操作日志查看（只读 grid） | 审计日志 UI |
| 3.7 OAuth 配置 | GitHub/Google 等第三方登录配置 | OAuth 配置页 |

---

## 6. 技术风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| better-auth API 不稳定 | 低 | 中 | 通过 `@object-ui/auth` 包抽象，解耦具体实现 |
| @objectstack/client token 注入兼容性 | 低 | 高 | 已验证 `fetch` 参数可用；增加 token 刷新失败的回退逻辑 |
| better-auth 与 ObjectStack 服务端集成 | 中 | 高 | better-auth 支持自定义数据库适配器，可对接 ObjectStack 用户表 |
| Session/Token 过期时数据请求失败 | 中 | 中 | AuthProvider 监听 401 响应，自动重定向到登录页 |
| 多租户会话隔离 | 低 | 高 | better-auth organization 插件 + @object-ui/tenant 双重隔离 |
| 包体积增加 | 低 | 低 | better-auth 客户端包体较小（~15KB gzip），可接受 |

---

## 7. 结论

### 可行性判定：✅ 完全可行

**@objectstack/client** 已提供完整的数据操作能力和灵活的认证集成接口（`token` 参数 + 自定义 `fetch`）。现有 Console 应用拥有完备的 UI 组件库（35 个包，91+ 组件），已具备列表、表单、仪表盘、看板、报表等全部业务功能。

**better-auth** 作为现代 TypeScript 认证框架，提供了从邮箱登录到 OAuth、从会话管理到多租户的完整认证解决方案，其 React 集成和插件体系与 ObjectUI 架构高度匹配。

两者结合可完整覆盖 Console 从登录到使用的所有功能需求：

```
登录 → 会话建立 → Token 注入 → 权限加载 → 业务使用 → 登出
 ✅       ✅          ✅          ✅         ✅        ✅
```

### 推荐行动

1. **立即启动** Phase 1（认证基础），预计 2 周可交付登录/注销核心流程
2. **优先实现** 自定义 `fetch` 模式的 token 注入，确保与现有 ObjectStackAdapter 无缝集成
3. **复用现有组件** — 系统管理页面可直接使用 plugin-grid + plugin-form，无需重新开发 CRUD UI
4. **抽象认证层** — 通过 `@object-ui/auth` 包抽象 better-auth，未来可替换为其他认证方案

---

*本文档将随开发进展持续更新。*
