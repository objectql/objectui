# Object UI CLI User Guide

## Introduction

Object UI CLI is a command-line tool that allows you to quickly build and run applications using JSON schema files.

## Installation

```bash
# Install globally
npm install -g @object-ui/cli

# Or using pnpm
pnpm add -g @object-ui/cli

# Or use with npx (no installation required)
npx @object-ui/cli --help
```

## Quick Start

### 1. Create a New Application

```bash
# Use default template (dashboard)
objectui init my-app

# Use specific template
objectui init my-app --template form

# Create in current directory
objectui init . --template simple
```

**Available Templates:**
- `dashboard` - Complete dashboard interface (default)
- `form` - Form example
- `simple` - Simple starter template

### 2. Start Development Server

```bash
# Navigate to app directory
cd my-app

# Start server
objectui serve app.schema.json

# Custom port
objectui serve app.schema.json --port 8080

# Specify host
objectui serve app.schema.json --host 0.0.0.0
```

### 3. Edit Schema

Open the `app.schema.json` file and modify the JSON content to see real-time updates in your application.

## Command Reference

### `objectui init [name]`

Create a new Object UI application.

**Arguments:**
- `[name]` - Application name (optional, default: `my-app`)

**Options:**
- `-t, --template <template>` - Template to use: `simple`, `form`, or `dashboard` (default: `dashboard`)

**Examples:**
```bash
objectui init blog --template dashboard
objectui init form-app --template form
objectui init . --template simple
```

### `objectui serve [schema]`

Start a development server to render your JSON schema.

**Arguments:**
- `[schema]` - Path to JSON schema file (optional, default: `app.schema.json`)

**Options:**
- `-p, --port <port>` - Server port (default: `3000`)
- `-h, --host <host>` - Server host (default: `localhost`)

**Examples:**
```bash
objectui serve
objectui serve my-schema.json
objectui serve app.schema.json --port 8080
objectui serve app.schema.json --host 0.0.0.0 --port 3001
```

## Schema Examples

### Simple Example

```json
{
  "type": "div",
  "className": "min-h-screen flex items-center justify-center",
  "body": {
    "type": "card",
    "title": "Welcome to Object UI",
    "body": {
      "type": "text",
      "content": "Start building your application!"
    }
  }
}
```

### Form Example

```json
{
  "type": "div",
  "className": "min-h-screen flex items-center justify-center p-4",
  "body": {
    "type": "card",
    "className": "w-full max-w-md",
    "title": "Contact Us",
    "body": {
      "type": "div",
      "className": "p-6 space-y-4",
      "body": [
        {
          "type": "input",
          "label": "Name",
          "placeholder": "Enter your name"
        },
        {
          "type": "input",
          "label": "Email",
          "inputType": "email",
          "placeholder": "your@email.com"
        },
        {
          "type": "textarea",
          "label": "Message",
          "placeholder": "Enter your message"
        },
        {
          "type": "button",
          "label": "Submit",
          "className": "w-full"
        }
      ]
    }
  }
}
```

## Adding Routing to Your Application

By default, the CLI generates a single-page application. To add routing capabilities, you'll need to manually set up React Router in your generated application.

### Step 1: Install React Router

Navigate to your `.objectui-tmp` directory after running `objectui serve`:

```bash
cd .objectui-tmp
npm install react-router-dom
```

### Step 2: Create Multiple Schema Files

Create separate schema files for each route:

**home.schema.json:**
```json
{
  "type": "div",
  "className": "p-8",
  "body": {
    "type": "card",
    "title": "Home Page",
    "body": {
      "type": "text",
      "content": "Welcome to the home page!"
    }
  }
}
```

**about.schema.json:**
```json
{
  "type": "div",
  "className": "p-8",
  "body": {
    "type": "card",
    "title": "About Page",
    "body": {
      "type": "text",
      "content": "Learn more about us!"
    }
  }
}
```

### Step 3: Modify App.tsx

Update the generated `src/App.tsx` in `.objectui-tmp/src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { SchemaRenderer } from '@object-ui/react';
import '@object-ui/components';
import homeSchema from './schemas/home.schema.json';
import aboutSchema from './schemas/about.schema.json';

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-100 p-4">
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<SchemaRenderer schema={homeSchema} />} />
        <Route path="/about" element={<SchemaRenderer schema={aboutSchema} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Alternative: Schema-Based Navigation

You can also define navigation in your main schema using button click handlers:

```json
{
  "type": "div",
  "className": "min-h-screen",
  "body": [
    {
      "type": "div",
      "className": "bg-gray-100 p-4 flex gap-4",
      "body": [
        {
          "type": "button",
          "label": "Home",
          "variant": "ghost",
          "onClick": "navigate('/')"
        },
        {
          "type": "button",
          "label": "About",
          "variant": "ghost",
          "onClick": "navigate('/about')"
        }
      ]
    },
    {
      "type": "div",
      "className": "p-8",
      "body": "<!-- Page content here -->"
    }
  ]
}
```

**Note:** Full schema-based routing support is planned for a future release. Currently, routing requires manual React Router setup in the generated code.

## FAQ

### 1. How to customize styles?

Object UI uses Tailwind CSS. You can add Tailwind classes to any component's `className` property:

```json
{
  "type": "button",
  "label": "Button",
  "className": "bg-blue-500 hover:bg-blue-600 text-white"
}
```

### 2. How to use data binding?

Use the `${expression}` syntax:

```json
{
  "type": "text",
  "content": "Welcome, ${user.name}!"
}
```

### 3. What components are supported?

See the complete component list:
- [Component Documentation](https://www.objectui.org/docs/api/components)
- [Protocol Specification](https://www.objectui.org/docs/protocol/overview)

## Learn More

- [Official Website](https://www.objectui.org)
- [Documentation](https://www.objectui.org/docs)
- [GitHub Repository](https://github.com/objectql/objectui)
- [Examples](https://github.com/objectql/objectui/tree/main/examples)

## License

MIT
