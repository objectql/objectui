# Object UI Documentation Site

This is the official documentation site for Object UI, built with [Fumadocs](https://fumadocs.vercel.app/).

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
apps/site/
├── app/                  # Next.js app directory
│   ├── docs/            # Documentation pages
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── content/             # MDX documentation content
│   └── docs/            # Documentation markdown files
├── lib/                 # Library code
│   └── source.ts        # Fumadocs source configuration
├── public/              # Static assets
├── next.config.mjs      # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── source.config.ts     # Fumadocs MDX configuration
```

## Features

- 📝 MDX-based documentation
- 🎨 Built with Tailwind CSS
- 🌗 Dark mode support
- 🔍 Full-text search (coming soon)
- 📱 Responsive design
- ⚡ Fast page loads with Next.js

## Adding Documentation

1. Create a new `.mdx` file in `content/docs/`
2. Add frontmatter with title and description:
   ```mdx
   ---
   title: Your Page Title
   description: Page description
   ---
   
   # Your Content Here
   ```
3. Update `content/docs/meta.json` to add the page to navigation

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [Fumadocs](https://fumadocs.vercel.app/) - Documentation framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
