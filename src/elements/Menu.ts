import { BaseElement } from "./BaseElement";
import { expect, Locator, Page } from "@playwright/test";
import { step } from "@src/utils/step";

export class Menu extends BaseElement {
  readonly trigger: Locator;
  readonly panel: Locator;

  constructor(page: Page, trigger: Locator | string) {
    super(page);
    this.trigger =
      typeof trigger === "string" ? this.page.locator(trigger) : trigger;
    this.panel = this.page.locator(".mat-mdc-menu-panel");
  }

  async open() {
    const isExpanded = await this.trigger.getAttribute("aria-expanded");
    if (isExpanded !== "true") {
      await this.trigger.click();
      await expect(this.panel.last()).toBeVisible();
    }
  }

  async clickItem(selector: string | Locator) {
    await this.open();
    const item =
      typeof selector === "string"
        ? this.panel.last().locator(selector)
        : selector;
    await item.click();
  }

  @step((name: string) => `Select menu item: ${name}`)
  async selectItem(name: string) {
    const itemLocator = this.panel
      .last()
      .getByRole("menuitem", { name: name, exact: false });
    await this.clickItem(itemLocator);
  }

  @step((email: string) => `Verify menu shows user email: ${email}`)
  async expectUserEmail(email: string) {
    await this.open();
    await expect(this.panel.last()).toContainText(email);
  }

  @step((text: string) => `Verify menu does not contain: ${text}`)
  async expectContentNotPresent(text: string) {
    await this.open();
    await expect(this.panel.last()).not.toContainText(text);
  }
}
