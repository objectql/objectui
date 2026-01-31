# 元数据驱动组件的自动化测试方法 (MSW)

## Automated Testing Method for Metadata-Driven Components using MSW

本文档描述了如何使用 MSW (Mock Service Worker) 来测试元数据驱动的表格和表单组件。

This document describes how to use MSW (Mock Service Worker) to test metadata-driven tables and forms.

## 概述 / Overview

ObjectUI 的核心功能是通过 JSON 元数据自动生成 UI 组件。为了确保这些组件能够正确地与后端 API 交互，我们采用 MSW 来模拟 API 调用，实现完整的集成测试。

ObjectUI's core functionality is to automatically generate UI components from JSON metadata. To ensure these components interact correctly with backend APIs, we use MSW to mock API calls for comprehensive integration testing.

## 架构 / Architecture

```
┌─────────────────┐
│   Test Suite    │
│  (Vitest)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐       ┌──────────────────┐
│  ObjectGrid /   │◄──────┤  MockDataSource  │
│  ObjectForm     │       └────────┬─────────┘
└────────┬────────┘                │
         │                         │
         │ HTTP Requests           │
         ▼                         ▼
┌─────────────────────────────────────┐
│           MSW Server                │
│  (Mock Service Worker - Node)       │
│                                     │
│  • Mock API Endpoints               │
│  • Request/Response Handlers        │
│  • In-Memory Data Store             │
└─────────────────────────────────────┘
```

## 核心组件 / Core Components

### 1. MSW Test Utilities (`msw-test-utils.ts`)

提供测试所需的所有工具函数和辅助类：

Provides all utility functions and helper classes needed for testing:

- **Mock Data Schemas**: 模拟的对象架构定义 (task, user)
- **Mock Data**: 测试用的示例数据
- **MockDataStore**: 内存数据存储，支持 CRUD 操作
- **API Handlers**: MSW 请求处理器，模拟 ObjectStack/ObjectQL API
- **MockDataSource**: 实现 DataSource 接口的模拟适配器
- **setupMSW()**: 测试设置辅助函数

### 2. Integration Tests

#### ObjectGrid Tests (`ObjectGrid.msw.test.tsx`)

测试元数据驱动的表格组件：

Tests for metadata-driven grid component:

- ✅ 从 API 获取并显示数据
- ✅ 基于元数据架构显示列
- ✅ 支持分页参数
- ✅ 支持内联数据（无需 API）
- ✅ CRUD 操作按钮
- ✅ 错误处理
- ✅ 行选择功能
- ✅ 搜索和过滤

#### ObjectForm Tests (`ObjectForm.msw.test.tsx`)

测试元数据驱动的表单组件：

Tests for metadata-driven form component:

- ✅ Create 模式：从 API 获取架构，渲染空表单
- ✅ Edit 模式：获取架构和记录数据
- ✅ View 模式：只读模式显示
- ✅ 提交新记录到 API
- ✅ 更新记录
- ✅ 必填字段验证
- ✅ 内联字段（无需 API）
- ✅ 错误处理
- ✅ 不同字段类型支持

## 使用方法 / Usage

### 基本测试设置 / Basic Test Setup

```typescript
import { setupMSW, MockDataSource } from '@object-ui/react/src/__tests__/utils/msw-test-utils';

// Setup MSW server for all tests
const server = setupMSW();

describe('My Component Tests', () => {
  let dataSource: MockDataSource;

  beforeEach(() => {
    dataSource = new MockDataSource();
  });

  it('should fetch and display data', async () => {
    const schema = {
      type: 'object-grid',
      objectName: 'task',
      columns: ['subject', 'priority'],
    };

    render(<ObjectGrid schema={schema} dataSource={dataSource} />);

    await waitFor(() => {
      expect(screen.getByText('Complete project documentation')).toBeInTheDocument();
    });
  });
});
```

### 测试表格 / Testing Grids

```typescript
it('should display data from mocked API', async () => {
  const schema: ObjectGridSchema = {
    type: 'object-grid',
    objectName: 'task',
    columns: ['subject', 'priority', 'isCompleted'],
  };

  render(<ObjectGrid schema={schema} dataSource={dataSource} />);

  // Wait for data to load from MSW
  await waitFor(() => {
    expect(screen.getByText('Complete project documentation')).toBeInTheDocument();
  });
});
```

### 测试表单提交 / Testing Form Submission

```typescript
it('should submit new record via API', async () => {
  const onSuccess = vi.fn();
  const user = userEvent.setup();

  const schema: ObjectFormSchema = {
    type: 'object-form',
    objectName: 'task',
    mode: 'create',
    fields: ['subject', 'priority'],
    onSuccess,
  };

  render(<ObjectForm schema={schema} dataSource={dataSource} />);

  await waitFor(() => {
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
  });

  // Fill the form
  await user.type(screen.getByLabelText('Subject'), 'New Task');
  await user.type(screen.getByLabelText('Priority'), '7');

  // Submit
  await user.click(screen.getByText('Create'));

  // Verify API was called
  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalled();
  });
});
```

### 使用内联数据 / Using Inline Data

对于不需要 API 的场景，可以使用内联数据：

For scenarios that don't require API calls, use inline data:

```typescript
it('should work with inline data', async () => {
  const schema: ObjectGridSchema = {
    type: 'object-grid',
    objectName: 'task',
    columns: ['subject', 'priority'],
    data: {
      provider: 'value',
      items: [
        { id: '1', subject: 'Task A', priority: 1 },
        { id: '2', subject: 'Task B', priority: 2 },
      ],
    },
  };

  render(<ObjectGrid schema={schema} />);

  await waitFor(() => {
    expect(screen.getByText('Task A')).toBeInTheDocument();
  });
});
```

## API 端点 / API Endpoints

MSW 模拟以下 ObjectStack/ObjectQL API 端点：

MSW mocks the following ObjectStack/ObjectQL API endpoints:

- `GET /api/v1` - Discovery endpoint
- `GET /api/v1/schema/:object` - Get object schema
- `GET /api/v1/data/:object` - Find records (with query params)
- `GET /api/v1/data/:object/:id` - Get single record
- `POST /api/v1/data/:object` - Create record
- `PUT /api/v1/data/:object/:id` - Update record
- `DELETE /api/v1/data/:object/:id` - Delete record

## 运行测试 / Running Tests

```bash
# 运行所有测试
# Run all tests
pnpm test

# 运行特定包的测试
# Run tests for specific package
pnpm --filter @object-ui/plugin-grid test

# 运行 MSW 集成测试
# Run MSW integration tests
pnpm test -- ObjectGrid.msw.test
pnpm test -- ObjectForm.msw.test

# 观察模式
# Watch mode
pnpm test:watch
```

## 最佳实践 / Best Practices

### 1. 使用 setupMSW() 辅助函数

在所有测试文件顶部调用 `setupMSW()` 来自动设置和清理 MSW 服务器：

Use `setupMSW()` helper at the top of test files for automatic server setup and cleanup:

```typescript
const server = setupMSW();
```

### 2. 重置数据存储

`setupMSW()` 会在每个测试后自动重置数据，确保测试隔离。

`setupMSW()` automatically resets data after each test for isolation.

### 3. 等待异步操作

使用 `waitFor()` 等待 API 调用和 UI 更新：

Use `waitFor()` to wait for API calls and UI updates:

```typescript
await waitFor(() => {
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### 4. 模拟用户交互

使用 `@testing-library/user-event` 模拟真实用户行为：

Use `@testing-library/user-event` for realistic user interactions:

```typescript
const user = userEvent.setup();
await user.type(input, 'text');
await user.click(button);
```

### 5. 测试错误场景

确保测试错误处理路径：

Ensure error handling paths are tested:

```typescript
it('should handle API errors', async () => {
  const schema = {
    type: 'object-grid',
    objectName: 'nonexistent',
  };

  render(<ObjectGrid schema={schema} dataSource={dataSource} />);

  await waitFor(() => {
    expect(screen.getByText(/Error/i)).toBeInTheDocument();
  });
});
```

## 扩展 / Extensions

### 添加新的模拟对象 / Adding New Mock Objects

在 `msw-test-utils.ts` 中添加新的架构和数据：

Add new schemas and data in `msw-test-utils.ts`:

```typescript
export const mockProductSchema = {
  name: 'product',
  label: 'Product',
  fields: {
    id: { name: 'id', label: 'ID', type: 'text' },
    name: { name: 'name', label: 'Name', type: 'text' },
    price: { name: 'price', label: 'Price', type: 'currency' },
  },
};

export const mockProducts = [
  { id: '1', name: 'Product A', price: 99.99 },
  { id: '2', name: 'Product B', price: 149.99 },
];

// 更新 MockDataStore
class MockDataStore {
  private data: Record<string, any[]> = {
    task: [...mockTasks],
    user: [...mockUsers],
    product: [...mockProducts], // 添加新对象
  };

  private schemas: Record<string, any> = {
    task: mockTaskSchema,
    user: mockUserSchema,
    product: mockProductSchema, // 添加新架构
  };
  // ...
}
```

### 自定义 API 行为 / Custom API Behavior

可以在测试中覆盖默认的 MSW 处理器：

Override default MSW handlers in tests:

```typescript
it('should handle custom API response', async () => {
  server.use(
    http.get('/api/v1/data/task', () => {
      return HttpResponse.json({
        data: [{ id: '1', subject: 'Custom Task' }],
      });
    })
  );

  // Test continues...
});
```

## 故障排除 / Troubleshooting

### MSW 未拦截请求

确保在测试开始前调用了 `setupMSW()`。

Ensure `setupMSW()` is called before tests run.

### 数据未重置

`setupMSW()` 的 `afterEach` 钩子会自动重置数据。如果需要手动重置：

The `afterEach` hook in `setupMSW()` automatically resets data. For manual reset:

```typescript
mockDataStore.reset();
```

### 类型错误

确保导入正确的类型：

Ensure correct types are imported:

```typescript
import type { ObjectGridSchema, ObjectFormSchema } from '@object-ui/types';
```

## 总结 / Summary

这个测试方法提供了：

This testing approach provides:

- ✅ **真实的 API 交互**: MSW 模拟真实的 HTTP 请求/响应
- ✅ **隔离的测试环境**: 每个测试都有独立的数据状态
- ✅ **完整的集成测试**: 测试组件与 API 的完整交互流程
- ✅ **可维护性**: 集中管理模拟数据和 API 行为
- ✅ **类型安全**: 使用 TypeScript 确保类型正确性
- ✅ **可扩展性**: 轻松添加新的对象类型和测试场景

通过这种方法，我们可以确保元数据驱动的组件在各种场景下都能正常工作，提高代码质量和可靠性。

With this approach, we can ensure metadata-driven components work correctly in various scenarios, improving code quality and reliability.
