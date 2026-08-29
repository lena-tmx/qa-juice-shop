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
     * and this loop can re-check and re-dismiss it, rather than the whole
     * page hanging for 30s on a single stuck click.
     */
    let lastError: unknown;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await this.welcomeBanner.closeIfVisible();
        await this.cookieBanner.closeIfVisible();
        return;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  }

  protected async clickAfterDismissingBanners(
    locator: Locator,
  ): Promise<void> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.dismissBlockingBanners();
      try {
        await locator.click({ timeout: 5000 });
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }
}
