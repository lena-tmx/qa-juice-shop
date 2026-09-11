import { qase } from "playwright-qase-reporter";
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe(`Search UI`, () => {
  test(
    qase(86, `Product search displays an item matching its name`),
    { tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.SEARCH] },
    async ({ ui }) => {
      await ui.homePage.open();
      await ui.homePage.expectLoaded();
      await ui.homePage.navbar.search("OWASP Juice Shop Hoodie");
      await ui.homePage.expectProductVisible("OWASP Juice Shop Hoodie");
    },
  );

  test(
    qase(87, `Product search displays no results for an unmatched query`),
    { tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.SEARCH] },
    async ({ ui }) => {
      await ui.homePage.open();
      await ui.homePage.expectLoaded();
      await ui.homePage.navbar.search("NotFound");
      await ui.homePage.expectNoResultsFound();
    },
  );
});
