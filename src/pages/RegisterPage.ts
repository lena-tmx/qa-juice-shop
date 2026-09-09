import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { step } from "@src/utils/step";
import type { TestUser } from "@src/data/factories/userFactory";

export class RegisterPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly repeatPasswordInput: Locator;
  private readonly securityQuestionSelect: Locator;
  private readonly securityAnswerInput: Locator;
  private readonly registerButton: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page.getByRole("textbox", {
      name: "Email address field",
    });
    this.passwordInput = page.getByRole("textbox", {
      name: "Field for the password",
    });
    this.repeatPasswordInput = page.getByRole("textbox", {
      name: "Field to confirm the password",
    });
    this.securityQuestionSelect = page.getByRole("combobox", {
      name: "Selection list for the security question",
    });
    this.securityAnswerInput = page.getByRole("textbox", {
      name: "Field for the answer to the security question",
    });
    this.registerButton = page.getByRole("button", {
      name: "Button to complete the registration",
    });
  }

  @step("Open registration page")
  async open(): Promise<void> {
    await super.open("/#/register");
    await this.dismissBlockingBanners();
  }

  @step("Register a new user")
  async register(user: TestUser): Promise<void> {
    await this.fillAfterDismissingBanners(this.emailInput, user.email);
    await this.fillAfterDismissingBanners(this.passwordInput, user.password);
    await this.fillAfterDismissingBanners(
      this.repeatPasswordInput,
      user.password,
    );

    await this.selectSecurityQuestion(user.securityQuestion.text);

    await this.fillAfterDismissingBanners(
      this.securityAnswerInput,
      user.securityQuestion.answer,
    );
    await this.clickAfterDismissingBanners(this.registerButton);
  }

  @step("Verify registration page is loaded")
  async expectLoaded(): Promise<void> {
    await this.dismissBlockingBanners();
    await expect(this.page).toHaveURL(/\/#\/register/);
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.repeatPasswordInput).toBeVisible();
    await expect(this.securityQuestionSelect).toBeVisible();
    await expect(this.securityAnswerInput).toBeVisible();
    await expect(this.registerButton).toBeVisible();
  }

  @step("Verify registration completed successfully")
  async expectRegistrationSucceeded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/#\/login/);
  }

  private async selectSecurityQuestion(question: string): Promise<void> {
    await this.clickAfterDismissingBanners(
      this.securityQuestionSelect.locator(".mat-mdc-select-arrow-wrapper"),
    );
    await this.page
      .getByRole("option", {
        name: question,
        exact: true,
      })
      .click();
  }
}
