import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe("Product Details API", () => {
  test(
    qase(32, "Product details API returns the requested product by identifier"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.POSITIVE],
    },
    async ({ services }) => {
      const product = await services.products.getById(1);

      expect(product.id).toBe(1);
      expect(product.name).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
    },
  );

  test(
    qase(73, "Product details API returns HTTP 404 for an unknown identifier"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api, apiResponse }) => {
      const response = await api.products.getById(99999);

      await apiResponse.expectStatus(response, 404);
    },
  );
});
