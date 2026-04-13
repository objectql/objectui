import { chromium } from 'playwright';

async function findTailwindGeneratedRule() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  try {
    await page.goto('http://localhost:5174/console/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const allRules = await page.evaluate(() => {
      const escapedClass = 'group-data-\\[collapsible\\=icon\\]\\:\\!size-8';

      const rules = [];
      Array.from(document.styleSheets).forEach((sheet, sheetIdx) => {
        try {
          Array.from(sheet.cssRules || []).forEach((rule, ruleIdx) => {
            const selector = rule.selectorText || '';
            if (selector.includes(escapedClass)) {
              rules.push({
                sheetIndex: sheetIdx,
                ruleIndex: ruleIdx,
                selector,
                cssText: rule.cssText.substring(0, 200),
                href: sheet.href || 'inline'
              });
            }
          });
        } catch (e) {}
      });

      return rules;
    });

    console.log('Total rules matching group-data-[collapsible=icon]:!size-8:',  allRules.length);
    allRules.forEach((rule, i) => {
      console.log(`\n${i + 1}. ${rule.selector}`);
      console.log(`   Sheet: ${rule.href}`);
      console.log(`   CSS: ${rule.cssText}`);
    });
  } finally {
    await browser.close();
  }
}

findTailwindGeneratedRule().catch(console.error);
