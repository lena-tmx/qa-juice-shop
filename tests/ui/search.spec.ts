import { qase } from "playwright-qase-reporter";
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe(`Search UI`, () => {
  test(
    qase(86, `should search for a product`),
    { tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.SEARCH] },
    async ({ pages }) => {
      await pages.homePage.open();
      await pages.homePage.expectLoaded();
      await pages.homePage.navbar.search("OWASP Juice Shop Hoodie");
      await pages.homePage.expectProductVisible("OWASP Juice Shop Hoodie");
    },
  );

  test(
    qase(87, `should display no results found`),
    { tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.SEARCH] },
    async ({ pages }) => {
      await pages.homePage.open();
      await pages.homePage.expectLoaded();
      await pages.homePage.navbar.search("NotFound");
      await pages.homePage.expectNoResultsFound();
    },
  );
});
