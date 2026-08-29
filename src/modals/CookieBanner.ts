import { step } from "@src/utils/step";
import { BaseBanner } from "./BaseBanner";

export class CookieBanner extends BaseBanner {
  readonly container = this.page.getByLabel("cookieconsent");
  readonly dismissButton = this.page.getByLabel("dismiss cookie message");

  @step("Check whether cookie banner is visible")
  async isVisible(): Promise<boolean> {
    return await this.isShown(this.container);
  }

  @step("Dismiss cookie banner if visible")
  async closeIfVisible(): Promise<void> {
    if (!(await this.isVisible())) return;
    await this.clickAndWaitToDisappear(this.dismissButton, this.dismissButton);
  }
}
