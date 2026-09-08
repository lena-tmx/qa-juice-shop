import { productResponseSchema } from "@src/api/schemas/products.schemas";
import { parseApiResponse } from "@src/api/schemas/parseApiResponse";
import { Tags } from "../attributes/tags";
import { expect, test } from "../fixtures";

const PRODUCT_ID = 1;

test.describe("Product Details UI", () => {
  test(
    "should display product details matching the product data",
    {
      tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.POSITIVE],
    },
    async ({ api, pages }) => {
      const response = await api.products.getById(PRODUCT_ID);
      expect(response.status()).toBe(200);
      const { data: product } = await parseApiResponse(
        response,
        productResponseSchema,
      );

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
      const response = await api.products.getById(PRODUCT_ID);
      expect(response.status()).toBe(200);
      const { data: product } = await parseApiResponse(
        response,
        productResponseSchema,
      );

      await pages.homePage.open();
      await pages.homePage.openProductDetails(product.name);
      await pages.homePage.productDetailsModal.close();
    },
  );
});
