import { expect, Locator, Page } from "@playwright/test";

export abstract class BaseBanner {
  constructor(protected readonly page: Page) {}

  protected async isShown(locator: Locator): Promise<boolean> {
    return await locator.isVisible().catch(() => false);
  }

  protected async waitUntilGone(
    locator: Locator,
    timeout = 5000,
  ): Promise<void> {
    try {
      await locator.waitFor({ state: "hidden", timeout });
      return;
    } catch {}

    try {
      await locator.waitFor({ state: "detached", timeout });
      return;
    } catch {}

    await expect(locator).not.toBeVisible({ timeout });
  }

  protected async clickAndWaitToDisappear(
    button: Locator,
    container: Locator,
    timeout = 5000,
  ): Promise<void> {
    await expect(button).toBeVisible({ timeout });
    await expect(button).toBeEnabled({ timeout });
    // Bounded to `timeout` (not the global 30s action timeout): a click that
    // stays blocked this long means something unexpected is covering the
    // button (e.g. another banner's overlay), not a slow-to-settle UI — fail
    // fast so the caller can react instead of hanging for 30s.
    await button.click({ timeout });
    await this.waitUntilGone(container, timeout);
  }
}
