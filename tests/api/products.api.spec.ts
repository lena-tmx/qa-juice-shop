import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe("Products API", () => {
  test(
    qase(26, "Product catalog API returns available products"),
    {
      tag: [
        Tags.TEST_TYPE.API,
        Tags.FEATURE.PRODUCTS,
        Tags.TEST_TYPE.SMOKE,
        Tags.SCENARIO.POSITIVE,
      ],
    },
    async ({ services }) => {
      const products = await services.products.getAll();

      expect(products.length).toBeGreaterThan(0);
    },
  );

  test(
    qase(28, "Product search returns only items matching Apple"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.POSITIVE],
    },
    async ({ services, domain }) => {
      const products = await services.products.search("apple");

      expect(products.length).toBeGreaterThan(0);
      await domain.expectProductsContain(products, "apple");
    },
  );

  test(
    qase(29, "Product search returns an empty list for an unmatched query"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.NEGATIVE],
    },
    async ({ services }) => {
      const products = await services.products.search(
        "zzzzzzzz-no-such-product",
      );

      expect(products).toEqual([]);
    },
  );
});
