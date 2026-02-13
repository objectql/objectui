/**
 * ObjectStack Console Plugin
 *
 * Serves the pre-built Console SPA as a static UI plugin.
 * The mount path is auto-detected from the built assets (VITE_BASE_PATH
 * at build time determines asset prefixes and React Router basename).
 *
 * Build commands:
 *   pnpm build                          → base '/'        → mount at /
 *   VITE_BASE_PATH=/console/ pnpm build → base '/console' → mount at /console
 *
 * Usage in any ObjectStack application:
 *
 *   import { ConsolePlugin } from '@object-ui/console';
 *
 *   export default {
 *     plugins: [
 *       new HonoServerPlugin({ port: 3000 }),
 *       new ConsolePlugin(),
 *     ],
 *   };
 *
 * @see https://github.com/objectstack-ai/objectui
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Absolute path to the built SPA assets (dist/) */
export const staticPath = resolve(__dirname, 'dist');

/**
 * Detect the base path baked into dist/index.html at build time.
 *
 * Vite prefixes all asset URLs with the `base` config value.
 * We parse `<script … src="/console/assets/…">` to recover it.
 * Falls back to '/' when dist is missing or no prefix is found.
 */
function detectBasePath(distDir: string): string {
  const indexPath = resolve(distDir, 'index.html');
  if (!existsSync(indexPath)) return '/';
  const html = readFileSync(indexPath, 'utf-8');
  // Match src="/console/assets/..." or href="/console/assets/..."
  const match = html.match(/(?:src|href)="(\/[^"]*?)\/assets\//);
  if (match?.[1]) return match[1]; // e.g. '/console'
  return '/';
}

export class ConsolePlugin {
  readonly name = '@object-ui/console';
  readonly version = '1.0.0';
  readonly type = 'ui-plugin' as const;
  readonly slug = 'console';
  readonly staticPath = staticPath;
  readonly default = true;
  readonly description = 'ObjectStack Console - The standard runtime UI for ObjectStack applications';

  readonly metadata = {
    author: 'ObjectUI Team',
    license: 'MIT',
    homepage: 'https://www.objectui.org',
    repository: 'https://github.com/objectstack-ai/objectui',
    capabilities: [
      'ui-rendering',
      'crud-operations',
      'multi-app-support',
      'dynamic-navigation',
      'theme-support',
    ],
  };

  init() {
    // No initialization needed
  }

  async start(ctx: any) {
    const httpService = ctx.getService?.('http-server') || ctx.getService?.('http.server');
    if (!httpService || typeof httpService.getRawApp !== 'function') {
      const logger = ctx.logger || console;
      logger.warn('[Console] HTTP server not available. SPA routes not registered.');
      return;
    }

    const app = httpService.getRawApp();
    const logger = ctx.logger || console;
    const distDir = staticPath;

    if (!existsSync(distDir)) {
      logger.warn(`[Console] dist/ not found at ${distDir}. Run "pnpm build" first.`);
      return;
    }

    // Auto-detect mount path from the build output
    const basePath = detectBasePath(distDir);
    const isRoot = basePath === '/';

    // Try to use @hono/node-server/serve-static for efficient file serving
    let serveStaticFn: any;
    try {
      const mod = await import('@hono/node-server/serve-static');
      serveStaticFn = mod.serveStatic;
    } catch {
      // Fallback: manual file serving if @hono/node-server not available
      serveStaticFn = null;
    }

    const routePattern = isRoot ? '/*' : `${basePath}/*`;
    const stripPrefix = isRoot
      ? (p: string) => p
      : (p: string) => p.replace(new RegExp(`^${basePath}`), '');

    if (serveStaticFn) {
      // Serve static assets
      app.use(routePattern, serveStaticFn({
        root: distDir,
        rewriteRequestPath: stripPrefix,
      }));

      // SPA fallback: any non-file route → dist/index.html
      app.get(routePattern, serveStaticFn({
        root: distDir,
        rewriteRequestPath: () => '/index.html',
      }));
    } else {
      // Manual fallback when serveStatic is unavailable
      const indexPath = resolve(distDir, 'index.html');

      app.get(routePattern, async (c: any) => {
        // Skip API routes
        if (c.req.path.startsWith('/api')) return c.text('Not Found', 404);

        const reqPath = stripPrefix(c.req.path);
        const filePath = resolve(distDir, reqPath.replace(/^\//, ''));

        // Try to serve the exact file first
        if (existsSync(filePath) && !filePath.endsWith('/')) {
          const ext = filePath.split('.').pop() || '';
          const mimeTypes: Record<string, string> = {
            js: 'application/javascript',
            css: 'text/css',
            json: 'application/json',
            html: 'text/html',
            svg: 'image/svg+xml',
            png: 'image/png',
            ico: 'image/x-icon',
            woff2: 'font/woff2',
            woff: 'font/woff',
            gz: 'application/gzip',
            br: 'application/x-brotli',
          };
          const contentType = mimeTypes[ext] || 'application/octet-stream';
          const content = readFileSync(filePath);
          return c.body(content, 200, { 'Content-Type': contentType });
        }

        // SPA fallback: return index.html
        if (existsSync(indexPath)) {
          return c.html(readFileSync(indexPath, 'utf-8'));
        }
        return c.text('Console not built. Run: pnpm --filter @object-ui/console build', 404);
      });
    }

    // Only redirect / → basePath when NOT mounted at root
    if (!isRoot) {
      app.get('/', (c: any) => c.redirect(basePath));
    }

    logger.info(`[Console] SPA mounted at ${isRoot ? '/' : basePath}`);
  }
}

export default ConsolePlugin;
