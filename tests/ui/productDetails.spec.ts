import { Tags } from "../attributes/tags";
import { test } from "../fixtures";

const PRODUCT_ID = 1;

test.describe("Product Details UI", () => {
  test(
    "Product details dialog matches the selected catalog product",
    {
      tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.POSITIVE],
    },
    async ({ services, ui }) => {
      const product = await services.products.getById(PRODUCT_ID);

      await ui.homePage.open();
      await ui.homePage.openProductDetails(product.name);
      await ui.homePage.productDetailsModal.expectProductDetails(product);
    },
  );

  test(
    "Product details dialog closes when the close button is selected",
    {
      tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.POSITIVE],
    },
    async ({ services, ui }) => {
      const product = await services.products.getById(PRODUCT_ID);

      await ui.homePage.open();
      await ui.homePage.openProductDetails(product.name);
      await ui.homePage.productDetailsModal.close();
    },
  );
});
