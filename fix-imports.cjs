
const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'packages/components/src/ui');

try {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    if (!file.endsWith('.tsx')) return;
    
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file contains the incorrect import
    if (content.includes('registry/')) {
      console.log(`Fixing imports in ${file}...`);
      
      // Replace @/registry/default/ui/ with ./
      content = content.replace(/@\/registry\/default\/ui\//g, './');
      
      // Replace @/registry/new-york/ui/ with ./
      content = content.replace(/@\/registry\/new-york\/ui\//g, './');

      // Replace @/registry/default/hooks/ with ../hooks/
      content = content.replace(/@\/registry\/default\/hooks\//g, '../hooks/');

      // Replace @/registry/default/lib/ with ../lib/
      content = content.replace(/@\/registry\/default\/lib\//g, '../lib/');
      
      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
  
  console.log('Finished fixing imports.');
} catch (err) {
  console.error('Error processing files:', err);
  process.exit(1);
}
