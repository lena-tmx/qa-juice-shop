import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe("Products API", () => {
  test(
    qase(26, "should return products"),
    {
      tag: [
        Tags.TEST_TYPE.API,
        Tags.FEATURE.PRODUCTS,
        Tags.TEST_TYPE.SMOKE,
        Tags.SCENARIO.POSITIVE,
      ],
    },
    async ({ api }) => {
      const products = await api.products.getAll();

      expect(products.length).toBeGreaterThan(0);
    },
  );

  test(
    qase(28, "should find apple product in search"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.POSITIVE],
    },
    async ({ api, domain }) => {
      const products = await api.products.search("apple");

      expect(products.length).toBeGreaterThan(0);
      await domain.expectProductsContain(products, "apple");
    },
  );

  test(
    qase(29, "should return empty search result"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api }) => {
      const products = await api.products.search("zzzzzzzz-no-such-product");

      expect(products).toEqual([]);
    },
  );
});
