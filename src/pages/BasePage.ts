import { Locator, Page } from "@playwright/test";
import { step } from "@src/utils/step";
import { WelcomeBanner } from "../modals/WelcomeBanner";
import { CookieBanner } from "../modals/CookieBanner";

export class BasePage {
  protected readonly page: Page;
  readonly welcomeBanner: WelcomeBanner;
  readonly cookieBanner: CookieBanner;

  constructor(page: Page) {
    this.page = page;
    this.welcomeBanner = new WelcomeBanner(page);
    this.cookieBanner = new CookieBanner(page);
  }

  async open(path: string): Promise<void> {
    await this.page.goto(path);
  }

  @step("Dismiss blocking banners")
  async dismissBlockingBanners(): Promise<void> {
    /**
     * Juice Shop's async language auto-detection can remount the welcome
     * banner mid-flow, right after it was dismissed once, re-showing its
     * overlay backdrop just as we try to click the cookie banner underneath
     * it. Each banner-close attempt is bounded to a few seconds (see
     * BaseBanner.clickAndWaitToDisappear) instead of the global 30s action
     * timeout, so a click blocked by a freshly-remounted banner fails fast
     * and the bounded retry can re-check and re-dismiss it, rather than the
     * whole page hanging for 30s on a single stuck click.
     */
    await this.retry(async () => {
      await this.welcomeBanner.closeIfVisible();
      await this.cookieBanner.closeIfVisible();
    });
  }

  protected async clickAfterDismissingBanners(locator: Locator): Promise<void> {
    await this.retry(async () => {
      await this.dismissBlockingBanners();
      await locator.click({ timeout: 5000 });
    });
  }

  protected async fillAfterDismissingBanners(
    locator: Locator,
    value: string,
  ): Promise<void> {
    await this.retry(async () => {
      await this.dismissBlockingBanners();
      await locator.fill(value, { timeout: 5000 });
    });
  }

  private async retry(
    action: () => Promise<void>,
    attempts = 3,
  ): Promise<void> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        await action();
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }
}
