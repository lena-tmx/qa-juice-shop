import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { step } from "@src/utils/step";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByRole("textbox", {
      name: /text field for the login password/i,
    });
    this.loginButton = page
      .getByRole("button", { name: /log in|login/i })
      .first();
  }

  @step("Open login page")
  async open(): Promise<void> {
    await super.open("/#/login");
    await this.dismissBlockingBanners();
  }

  @step("Verify login page is loaded")
  async expectLoaded(): Promise<void> {
    await this.dismissBlockingBanners();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  @step("Log in with credentials")
  async login(email: string, password: string): Promise<void> {
    await this.dismissBlockingBanners();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.dismissBlockingBanners();
    await this.loginButton.click();
  }
}
