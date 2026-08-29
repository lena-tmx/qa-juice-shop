import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";

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
      ).toBeLessThan(500);

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
      let dialogTriggered = false;
      let dialogMessage = "";

      page.on("dialog", async (dialog) => {
        dialogTriggered = true;
        dialogMessage = dialog.message();
        await dialog.dismiss();
      });

      await pages.homePage.open();
      await pages.homePage.expectLoaded();

      const searchResponsePromise = page.waitForResponse((response) => {
        return (
          response.url().includes("/rest/products/search") &&
          response.request().method() === "GET"
        );
      });

      await pages.homePage.navbar.search(payload);
      await searchResponsePromise;
      await pages.homePage.expectNoResultsFound();

      const dialogErrorMessage = [
        "Expected no browser dialog to be displayed after submitting the XSS payload,",
        "but a dialog was triggered.",
        dialogMessage ? `Dialog message: "${dialogMessage}".` : "",
      ]
        .filter(Boolean)
        .join(" ");

      expect(dialogTriggered, dialogErrorMessage).toBeFalsy();
    },
  );
});
