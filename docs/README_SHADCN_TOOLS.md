# Shadcn Component Sync Tools

> 🇨🇳 **中文用户**: 查看 [COMPONENT_SYNC_SUMMARY.md](./COMPONENT_SYNC_SUMMARY.md) 获取中英文对照说明

**Complete toolset for keeping ObjectUI components synchronized with Shadcn UI.**

## 🚀 Quick Start

```bash
# 1. Analyze your components (offline, no network needed)
npm run shadcn:analyze

# 2. List all components
npm run shadcn:list

# 3. Update a component (online, needs internet)
npm run shadcn:update button -- --backup
```

## 📖 Documentation

| Document | Description | When to Read |
|----------|-------------|--------------|
| **[Quick Start Guide](./SHADCN_QUICK_START.md)** | Fast introduction with common workflows | Start here! |
| **[Demo Walkthrough](./SHADCN_DEMO.md)** | Real examples and scenarios | Learning by example |
| **[Complete Sync Guide](./SHADCN_SYNC.md)** | Comprehensive reference | Deep dive |
| **[Component Reference](../packages/components/README_SHADCN_SYNC.md)** | Component-specific info | While updating |
| **[Bilingual Summary](./COMPONENT_SYNC_SUMMARY.md)** | English/Chinese summary | Quick reference |

## 🎯 What Problem Does This Solve?

ObjectUI is built on Shadcn UI components. When Shadcn releases updates:

❌ **Without these tools:**
- No way to know which components are outdated
- Risk of overwriting ObjectUI customizations
- Manual comparison is time-consuming
- Easy to miss important updates

✅ **With these tools:**
- Automatic detection of outdated components
- Safe updates with backups
- Clear identification of customizations
- Offline and online modes
- Automated weekly checks

## 🛠️ Tools Included

### 1. Offline Analysis (`shadcn:analyze`)

Analyzes local components without requiring internet access.

```bash
npm run shadcn:analyze
```

**Shows:**
- Customization levels (unmodified, light, heavy)
- Data-slot attributes
- Custom variants
- Dark mode enhancements
- Update recommendations

### 2. Online Sync (`shadcn:check/update`)

Fetches latest from Shadcn registry and updates components.

```bash
# Check status
npm run shadcn:check

# Update single component
npm run shadcn:update button -- --backup

# Update all
npm run shadcn:update-all

# Show diff
npm run shadcn:diff button
```

### 3. GitHub Actions Workflow

Automatic weekly checks for outdated components.

- Runs every Monday at 9:00 AM UTC
- Creates issues when updates detected
- Can be manually triggered

## 📊 Current Status

Based on the latest analysis:

| Category | Count | Action |
|----------|-------|--------|
| ✅ Safe to Update | 4 | Can update directly |
| ⚠️ Review Required | 37 | Check diff first |
| 🔧 Manual Merge | 5 | Carefully merge changes |
| ● Custom Components | 14 | Do not update |

### Components by Category

**✅ Safe to Update:**
- `calendar`, `sonner`, `table`, `toast`

**🔧 Need Manual Merge:**
- `card` - Glassmorphism effects
- `form` - React Hook Form integration
- `label` - Enhanced with data-slots
- `skeleton` - Glassmorphism effects
- `tabs` - Custom animations

**● Custom ObjectUI (Do Not Update):**
- `button-group`, `calendar-view`, `chatbot`, `combobox`
- `date-picker`, `empty`, `field`, `filter-builder`
- `input-group`, `item`, `kbd`, `spinner`
- `timeline`, `toaster`

## 💡 Common Use Cases

### Use Case 1: Monthly Maintenance

```bash
# Check for updates
npm run shadcn:analyze

# Update safe components
npm run shadcn:update calendar -- --backup
npm run shadcn:update table -- --backup

# Test and commit
npm test
git commit -am "chore: update safe components"
```

### Use Case 2: Shadcn Major Update

```bash
# Analyze impact
npm run shadcn:analyze > before.txt

# Update all with backups
npm run shadcn:update-all

# Review changes
git diff packages/components/src/ui/

# Test thoroughly
npm test

# Commit or revert
git commit -am "chore: update to Shadcn vX.Y.Z"
# OR
git checkout packages/components/src/ui/
```

### Use Case 3: Adding New Component

```bash
# Check if it exists in Shadcn
npm run shadcn:list | grep "my-component"

# If yes, add to manifest then:
npm run shadcn:update my-component -- --backup

# Export in index.ts
echo "export * from './ui/my-component'" >> packages/components/src/index.ts

# Create renderer if needed
```

## 🎓 Learning Path

1. **Beginner**: Read [Quick Start](./SHADCN_QUICK_START.md)
2. **Practice**: Follow [Demo Walkthrough](./SHADCN_DEMO.md)
3. **Master**: Study [Complete Guide](./SHADCN_SYNC.md)

## ⚙️ Configuration

### Component Manifest

`packages/components/shadcn-components.json` tracks:

```json
{
  "components": {
    "button": {
      "source": "https://ui.shadcn.com/registry/...",
      "dependencies": ["@radix-ui/react-slot"]
    }
  },
  "customComponents": {
    "button-group": {
      "description": "Custom ObjectUI component"
    }
  }
}
```

### NPM Scripts

Added to root `package.json`:

```json
{
  "scripts": {
    "shadcn:analyze": "node scripts/component-analysis.js",
    "shadcn:check": "node scripts/shadcn-sync.js --check",
    "shadcn:update": "node scripts/shadcn-sync.js --update",
    "shadcn:update-all": "node scripts/shadcn-sync.js --update-all --backup",
    "shadcn:diff": "node scripts/shadcn-sync.js --diff",
    "shadcn:list": "node scripts/shadcn-sync.js --list"
  }
}
```

## 🔒 Safety Features

✅ **Automatic Backups**: All updates create timestamped backups
✅ **Git Integration**: Review changes with `git diff`
✅ **Offline Mode**: Analyze without network risk
✅ **Custom Detection**: Won't update ObjectUI components
✅ **Test Prompts**: Reminders to test after updates

## 🐛 Troubleshooting

### Network Issues

If `shadcn:check` fails:
1. Use offline mode: `npm run shadcn:analyze`
2. Use official CLI: `npx shadcn@latest add <component>`
3. Manual update from Shadcn docs

### Build Errors

After updating components:
```bash
# Clear cache
rm -rf packages/components/dist
rm -rf node_modules/.vite

# Rebuild
npm run build

# Check types
npm run type-check
```

### Restoring from Backup

```bash
# List backups
ls -la packages/components/.backup/

# Restore specific component
cp packages/components/.backup/button.tsx.1234567890.backup \
   packages/components/src/ui/button.tsx
```

## 📈 Roadmap

- [ ] Interactive CLI with prompts
- [ ] Visual diff viewer in browser
- [ ] Automatic PR creation for safe updates
- [ ] Component version history
- [ ] Migration guides for breaking changes
- [ ] VS Code extension integration

## 🤝 Contributing

Found an issue? Want to improve the tools?

1. Check [existing issues](https://github.com/objectstack-ai/objectui/issues?q=label%3Ashadcn-sync)
2. Read [Contributing Guide](../CONTRIBUTING.md)
3. Open an issue with `shadcn-sync` label

## 📄 License

MIT License - See [LICENSE](../LICENSE)

## 🔗 Related Links

- [ObjectUI Documentation](https://objectui.org)
- [Shadcn UI](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Made with ❤️ for the ObjectUI community**
