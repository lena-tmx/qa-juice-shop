import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { Navbar } from "../components/Navbar";
import { step } from "@src/utils/step";

export class HomePage extends BasePage {
  readonly navbar: Navbar;
  readonly pageTitle: Locator;
  readonly itemName: Locator;

  constructor(page: Page) {
    super(page);
    this.navbar = new Navbar(page);
    this.pageTitle = page.locator("body");
    this.itemName = page.locator(".info-box .name");
  }

  @step("Open home page")
  async open(): Promise<void> {
    await super.open("/");
    await this.dismissBlockingBanners();
  }

  @step("Verify home page is loaded")
  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/juice shop/i);
    await this.dismissBlockingBanners();
  }

  @step((productName: string) => `Verify product is visible: ${productName}`)
  async expectProductVisible(productName: string): Promise<void> {
    await this.dismissBlockingBanners();
    await expect(this.itemName).toContainText(productName);
  }

  @step("Verify no search results are displayed")
  async expectNoResultsFound(): Promise<void> {
    await this.dismissBlockingBanners();
    await expect(this.page.getByText(/no results found/i)).toBeVisible();
  }

  private productCard(productName: string): Locator {
    return this.page.locator("mat-card").filter({
      has: this.page.getByText(productName, { exact: false }),
    });
  }

  @step((productName: string) => `Add product to basket: ${productName}`)
  async addProductToBasket(productName: string): Promise<void> {
    await this.dismissBlockingBanners();

    const card = this.productCard(productName);
    await expect(card).toBeVisible();

    const addButton = card.getByRole("button", { name: /add to basket/i });
    await expect(
      this.page.locator(".mat-mdc-snack-bar-label.mdc-snackbar__label"),
    ).toBeVisible();
    await expect(addButton).toBeVisible();
    await addButton.click();
  }

  @step((productName: string) => `Add product to basket and wait for confirmation: ${productName}`)
  async addProductToBasketWithWait(productName: string): Promise<void> {
    await this.dismissBlockingBanners();

    const card = this.productCard(productName);
    await expect(card).toBeVisible();

    const addButton = card.getByRole("button", { name: /add to basket/i });
    await expect(addButton).toBeVisible();

    const addToBasketResponsePromise = this.page.waitForResponse((response) => {
      return (
        response.url().includes("/api/BasketItems") &&
        response.request().method() === "POST" &&
        [200, 201].includes(response.status())
      );
    });

    await addButton.click();
    await addToBasketResponsePromise;
  }
}
