import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe("Products Detail API", () => {
  test(
    qase(32, "should return product by id"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const product = await api.products.getById(1);

      expect(product.id).toBe(1);
      expect(product.name).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
    },
  );

  test(
    qase(73, "should return 404 for non-existent product id"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api, apiResponse }) => {
      const response = await api.products.getByIdResponse(99999);

      await apiResponse.expectStatus(response, 404);
    },
  );
});
