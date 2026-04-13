import { chromium } from 'playwright';

async function checkAllRulesForButton() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  try {
    await page.goto('http://localhost:5174/console/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const analysis = await page.evaluate(() => {
      const button = document.querySelector('[data-sidebar="menu-button"]');
      if (!button) return { error: 'Button not found' };

      // Find the EXACT class on the button
      const targetClass = 'group-data-[collapsible=icon]:!size-8';
      const escapedClass = 'group-data-\\[collapsible\\=icon\\]\\:\\!size-8';

      // Get all stylesheets and find rules that match this exact class
      const matchingRules = [];
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          Array.from(sheet.cssRules ||[]).forEach(rule => {
            const selector = rule.selectorText || '';
            // Check if selector contains the escaped class
            if (selector.includes(escapedClass) || selector.includes('!size-8')) {
              matchingRules.push({
                selector,
                cssText: rule.cssText,
                width: rule.style?.width || 'none',
                height: rule.style?.height || 'none'
              });
            }
          });
        } catch (e) {}
      });

      // Also check what the actual computed style is
      const computed = window.getComputedStyle(button);

      return {
        classOnButton: button.classList.contains(targetClass),
        allMatchingRules: matchingRules,
        computed: {
          width: computed.width,
          height: computed.height,
          display: computed.display
        }
      };
    });

    console.log(JSON.stringify(analysis, null, 2));
  } finally {
    await browser.close();
  }
}

checkAllRulesForButton().catch(console.error);
