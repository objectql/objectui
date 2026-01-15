# Designer Modes Example

This example demonstrates the three specialized designer modes in Object UI:

## 🎯 Designer Modes

### 1. Form Designer
Optimized for building forms with validation and field management.
- **Components**: Form fields, buttons, basic layout
- **Branding**: Emerald/Teal
- **Use Case**: Creating contact forms, registration forms, data entry forms

### 2. Layout Designer
Optimized for designing page layouts and structures.
- **Components**: Containers, grids, navigation, content
- **Branding**: Blue/Indigo
- **Use Case**: Creating page structures, dashboards, landing pages

### 3. General Designer
Full-featured designer with all available components.
- **Components**: All 30+ components
- **Branding**: Purple/Pink
- **Use Case**: Any UI design task requiring maximum flexibility

## 🚀 Running the Example

```bash
# Install dependencies (from root)
pnpm install

# Run the example
cd examples/designer-modes
pnpm dev
```

The application will start at `http://localhost:5173`

## 🎨 Features

- **Mode Switching**: Toggle between the three designer modes using the top navigation
- **Live Preview**: See your changes in real-time as you design
- **Schema Export**: Check the console to see the generated schema JSON
- **Persistence**: Switch modes while maintaining your design (uses the same schema)

## 📝 Usage

1. **Start with a Mode**: Choose Form Designer for forms, Layout Designer for page structures, or General Designer for everything
2. **Drag Components**: Drag components from the left panel to the canvas
3. **Configure Properties**: Select a component and edit its properties in the right panel
4. **Switch Modes**: Try switching between modes to see different component sets
5. **Export Schema**: The schema is logged to the console on every change

## 🔄 How It Works

```tsx
import { Designer } from '@object-ui/designer';

function App() {
  const [mode, setMode] = useState('general');
  
  return (
    <Designer 
      mode={mode}
      onSchemaChange={(schema) => console.log(schema)}
    />
  );
}
```

## 📚 Related Documentation

- [Specialized Designers Guide](../../packages/designer/SPECIALIZED_DESIGNERS.md)
- [Main Designer Documentation](../../packages/designer/README.md)
