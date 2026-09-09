import { expect, type Page } from "@playwright/test";
import type { ProductsService } from "@src/api/services/ProductsService";
import type { HomePage } from "@src/pages/HomePage";
import { step } from "@src/utils/step";
import { BrowserDialogMonitor } from "./BrowserDialogMonitor";

export class SearchSecurityWorkflow {
  constructor(
    private readonly page: Page,
    private readonly homePage: HomePage,
    private readonly products: ProductsService,
  ) {}

  @step("Verify product API does not reflect an XSS payload")
  async expectApiPayloadNotReflected(payload: string): Promise<void> {
    const response = await this.products.searchResponse(payload);
    const rawBody = await response.text();

    expect(
      response.status(),
      [
        "Expected products search API to handle the XSS payload successfully,",
        `but received ${response.status()} ${response.statusText()}.`,
        `Response body: ${rawBody}`,
      ].join(" "),
    ).toBe(200);
    expect(rawBody).not.toContain(payload);
  }

  @step("Verify product UI search does not execute an XSS payload")
  async expectUiPayloadNotExecuted(payload: string): Promise<void> {
    const dialogMonitor = new BrowserDialogMonitor(this.page);

    await this.homePage.open();
    await this.homePage.expectLoaded();

    const searchResponsePromise = this.page.waitForResponse((response) => {
      return (
        response.url().includes("/rest/products/search") &&
        response.request().method() === "GET"
      );
    });

    const {
      result: searchResponse,
      dialog: dialogEvidence,
      wasDialogTriggered,
    } = await dialogMonitor.observe(async () => {
      await this.homePage.navbar.search(payload);
      const searchResponse = await searchResponsePromise;
      await this.homePage.waitForSearchResultsRendered();
      return searchResponse;
    });

    expect(searchResponse.status()).toBe(200);
    expect(
      wasDialogTriggered,
      [
        "XSS vulnerability detected:",
        "the search payload executed JavaScript and opened a browser dialog.",
        `Payload: ${payload}`,
        `Dialog type: ${dialogEvidence?.type}`,
        `Dialog message: "${dialogEvidence?.message}".`,
      ].join(" "),
    ).toBe(false);
  }
}
