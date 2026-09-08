import { expect, Locator, Page } from "@playwright/test";
import { Product } from "@src/api/types/products.types";
import { step } from "@src/utils/step";

export class ProductDetailsModal {
  readonly dialog: Locator;
  readonly productName: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly image: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole("dialog");
    this.productName = this.dialog.getByRole("heading", { level: 1 });
    this.description = this.dialog.locator(".details-row h1 + div");
    this.price = this.dialog.locator(".item-price");
    this.image = this.dialog.getByRole("img");
    this.closeButton = this.dialog.getByRole("button", {
      name: "Close Dialog",
    });
  }

  @step("Verify product details modal is opened")
  async expectOpened(): Promise<void> {
    await expect(this.dialog).toBeVisible();
  }

  @step((product: Product) => `Verify product details: ${product.name}`)
  async expectProductDetails(product: Product): Promise<void> {
    await expect(this.productName).toHaveText(product.name);
    await expect(this.description).toHaveText(product.description);
    await expect(this.price).toContainText(product.price.toFixed(2));
    await expect(this.image).toBeVisible();
    await expect(this.image).toHaveAttribute("alt", product.name);
  }

  @step("Close product details modal")
  async close(): Promise<void> {
    await this.closeButton.click();
    await expect(this.dialog).toBeHidden();
  }
}
