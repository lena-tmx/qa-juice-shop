import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Navbar } from "../components/Navbar";
import { step } from "@src/utils/step";

export class BasketPage extends BasePage {
  readonly navbar: Navbar;
  private readonly title: Locator;

  constructor(page: Page) {
    super(page);
    this.navbar = new Navbar(page);
    this.title = this.page.getByRole("heading", { name: /basket/i });
  }

  @step("Verify basket page is loaded")
  async expectLoaded(): Promise<void> {
    await this.dismissBlockingBanners();
    await expect(this.page).toHaveURL(/basket/i);
    await expect(this.title).toBeVisible();
  }

  @step(
    (productName: string) =>
      `Verify product is present in basket: ${productName}`,
  )
  async expectProductInBasket(productName: string): Promise<void> {
    await expect(this.basketRow(productName)).toBeVisible();
  }

  @step((productName: string) => `Remove product from basket: ${productName}`)
  async removeProduct(productName: string): Promise<void> {
    const row = this.basketRow(productName);
    await expect(row).toBeVisible();

    const removeButton = this.removeProductButton(row);
    await expect(removeButton).toBeVisible();
    await removeButton.click();

    await expect(row).toHaveCount(0);
  }

  @step("Verify basket is empty")
  async expectBasketIsEmpty(): Promise<void> {
    await expect(this.page.locator("mat-row")).toHaveCount(0);
  }

  private basketRow(productName: string): Locator {
    return this.page.locator("mat-row").filter({
      has: this.page.locator("mat-cell.cdk-column-product", {
        hasText: productName,
      }),
    });
  }

  private removeProductButton(row: Locator): Locator {
    return row.locator("mat-cell.cdk-column-remove button");
  }
}
