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

  @step("Open menu")
  async open() {
    const isExpanded = await this.trigger.getAttribute("aria-expanded");
    if (isExpanded !== "true") {
      await this.trigger.click();
      await expect(this.panel.last()).toBeVisible();
    }
  }

  @step("Click menu item")
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

  @step("Verify menu shows user email")
  async expectUserEmail(email: string) {
    await this.open();
    await expect(this.panel.last()).toContainText(email);
  }

  @step("Verify menu content is not present")
  async expectContentNotPresent(text: string) {
    await this.open();
    await expect(this.panel.last()).not.toContainText(text);
  }
}
