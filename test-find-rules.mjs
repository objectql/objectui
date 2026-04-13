import { chromium } from 'playwright';

async function findConflictingRules() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  try {
    await page.goto('http://localhost:5174/console/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const rules = await page.evaluate(() => {
      const button = document.querySelector('[data-sidebar="menu-button"]');
      if (!button) return { error: 'Button not found' };

      // Get ALL CSS rules that might affect the button's width
      const allSheets = Array.from(document.styleSheets);
      const widthRules = [];

      for (const sheet of allSheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule.style && (rule.style.width || rule.style.height)) {
              // Check if this rule might apply to our button
              const text = rule.selectorText || '';
              if (text.includes('size-8') || text.includes('menu-button') || text.includes('group-data')) {
                widthRules.push({
                  selector: text,
                  width: rule.style.width,
                  height: rule.style.height,
                  important: rule.style.width?.includes('!important') || false,
                  sheet: sheet.href ? sheet.href.substring(sheet.href.lastIndexOf('/') + 1) : 'inline'
                });
              }
            }
          }
        } catch (e) {
          // CORS or other errors
        }
      }

      return {
        buttonHasClass: button.classList.contains('group-data-[collapsible=icon]:!size-8'),
        computedWidth: window.getComputedStyle(button).width,
        widthRules: widthRules.filter(r => r.selector && r.width)
      };
    });

    console.log(JSON.stringify(rules, null, 2));
  } finally {
    await browser.close();
  }
}

findConflictingRules().catch(console.error);
