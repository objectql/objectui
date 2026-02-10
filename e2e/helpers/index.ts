import type { Page } from '@playwright/test';

/** Wait for React to mount (at least one child inside #root). */
export async function waitForReactMount(page: Page) {
  await page.waitForFunction(
    () => (document.getElementById('root')?.children.length ?? 0) > 0,
    { timeout: 30_000 },
  );
}
