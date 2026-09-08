import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { BrowserDialogMonitor } from "../helpers/BrowserDialogMonitor";

test.describe("Input Validation", () => {
  test(
    qase(
      39,
      "should not reflect raw script payload in products search API response",
    ),
    {
      tag: [
        Tags.TEST_TYPE.SECURITY,
        Tags.TEST_TYPE.API,
        Tags.FEATURE.XSS,
        Tags.FEATURE.INPUT_VALIDATION,
        Tags.PRIORITY.CRITICAL,
      ],
    },
    async ({ api }) => {
      const payload = `<script>alert(1)</script>`;
      const response = await api.products.search(payload);
      const rawBody = await response.text();

      expect(
        response.status(),
        [
          "Expected products search API to handle the XSS payload without a server error,",
          `but received ${response.status()} ${response.statusText()}.`,
          `Response body: ${rawBody}`,
        ].join(" "),
      ).toBe(200);

      expect(rawBody).not.toContain(payload);
    },
  );

  test(
    qase(95, "should not execute script payload in UI search"),
    {
      tag: [
        Tags.TEST_TYPE.SECURITY,
        Tags.TEST_TYPE.UI,
        Tags.FEATURE.XSS,
        Tags.FEATURE.INPUT_VALIDATION,
        Tags.PRIORITY.CRITICAL,
      ],
    },
    async ({ page, pages }) => {
      const payload = `<img src=x onerror=alert('xss')>`;
      const dialogMonitor = new BrowserDialogMonitor(page);

      await pages.homePage.open();
      await pages.homePage.expectLoaded();

      const searchResponsePromise = page.waitForResponse((response) => {
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
        await pages.homePage.navbar.search(payload);
        return searchResponsePromise;
      });

      expect(searchResponse.status()).toBe(200);

      const dialogErrorMessage = [
        "XSS vulnerability detected:",
        "the search payload executed JavaScript and opened a browser dialog.",
        `Payload: ${payload}`,
        `Dialog type: ${dialogEvidence?.type}`,
        `Dialog message: "${dialogEvidence?.message}".`,
      ].join(" ");

      expect(wasDialogTriggered, dialogErrorMessage).toBe(false);
    },
  );
});
