# Object UI Examples

This directory contains example projects demonstrating different ways to build with Object UI.

## 🚀 Pure JSON Applications (Recommended)

These projects run directly with the Object UI CLI. No Node.js code, no build configs.

**Usage:**
```bash
npm install -g @object-ui/cli
objectui serve examples/<example-folder>
```

| Example | Description | Features |
| :--- | :--- | :--- |
| **[Dashboard](./dashboard)** | Single-File Application | `app.json`, Complex Grid Layouts, Stats Cards |
| **[CRM App](./crm-app)** | Multi-Page Enterprise App | **File-System Routing**, Dynamic Routes (`[id]`), Nested Folders |

## 🛠 Framework Integration (Advanced)

For developers who need to mix React code with JSON schema.

| Example | Description |
| :--- | :--- |
| **[React Integration](./framework-react)** | Vite + React + Tailwind setup. Shows how to import `<SchemaRenderer>` into an existing codebase. |
