import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe("Products Detail API", () => {
  test(
    "should return product by id",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const response = await api.products.getById(1);

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.id).toBe(1);
      expect(body.data.name).toBeTruthy();
      expect(body.data.price).toBeGreaterThan(0);
    },
  );

  test(
    "should return 404 for non-existent product",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api }) => {
      const response = await api.products.getById(99999);
      const status = response.status();

      expect(
        [404, 500].includes(status),
        `Expected 404 or 500 for non-existent product, but got ${status}`,
      ).toBeTruthy();
    },
  );
});
