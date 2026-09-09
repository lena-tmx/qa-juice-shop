import { Tags } from "../attributes/tags";
import { test } from "../fixtures";

const PRODUCT_ID = 1;

test.describe("Product Details UI", () => {
  test(
    "should display product details matching the product data",
    {
      tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.POSITIVE],
    },
    async ({ api, pages }) => {
      const product = await api.products.getById(PRODUCT_ID);

      await pages.homePage.open();
      await pages.homePage.openProductDetails(product.name);
      await pages.homePage.productDetailsModal.expectProductDetails(product);
    },
  );

  test(
    "should close the product details dialog",
    {
      tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.POSITIVE],
    },
    async ({ api, pages }) => {
      const product = await api.products.getById(PRODUCT_ID);

      await pages.homePage.open();
      await pages.homePage.openProductDetails(product.name);
      await pages.homePage.productDetailsModal.close();
    },
  );
});
