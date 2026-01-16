
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const showcaseDir = path.join(rootDir, 'examples/showcase');
const appJsonPath = path.join(showcaseDir, 'app.json');
const pagesDir = path.join(showcaseDir, 'pages');

const appConfig = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));

const iconMap = new Map();

function traverseMenu(items) {
  if (!items) return;
  for (const item of items) {
    if (item.path && item.icon) {
      iconMap.set(item.path, item.icon);
    }
    if (item.children) {
      traverseMenu(item.children);
    }
  }
}

traverseMenu(appConfig.menu);

console.log(`Found ${iconMap.size} icons in app.json menu.`);

function getRoutePath(absoluteFilePath) {
  let relativePath = path.relative(pagesDir, absoluteFilePath);
  // Remove extension
  const ext = path.extname(relativePath);
  let route = relativePath.slice(0, -ext.length);
  
  // Handle index
  if (route === 'index') return '/';
  if (route.endsWith('/index')) {
    route = route.slice(0, -6);
  }
  
  // Ensure leading slash
  if (!route.startsWith('/')) {
    route = '/' + route;
  }
  
  return route;
}

function processDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      const route = getRoutePath(fullPath);
      
      const icon = iconMap.get(route);
      
      if (icon) {
        try {
          const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
          
          if (content.type === 'page' && content.icon !== icon) {
             content.icon = icon;
             fs.writeFileSync(fullPath, JSON.stringify(content, null, 2) + '\n');
             console.log(`Updated ${route} with icon ${icon}`);
          }
        } catch (e) {
          console.error(`Error processing ${fullPath}:`, e);
        }
      }
          console.error(`Error processing ${fullPath}:`, e);
        }
      } else {
        // console.log(`No icon found for route ${route}`);
      }
    }
  }
}

processDirectory(pagesDir);
console.log('Done syncing icons.');
