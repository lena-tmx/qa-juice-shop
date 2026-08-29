import { qase } from 'playwright-qase-reporter';
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
      const response = await api.products.getAll();

      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(Array.isArray(body.data)).toBeTruthy();
      expect(body.data.length).toBeGreaterThan(0);
    },
  );

  test(
    qase(28, "should find apple product in search"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const response = await api.products.search("apple");

      expect(response.ok()).toBeTruthy();
      const body = await response.json();

      expect(Array.isArray(body.data)).toBeTruthy();
      expect(body.data.length).toBeGreaterThan(0);
      expect(
        body.data.some(
          (product: { name?: unknown }) =>
            typeof product.name === "string" &&
            product.name.toLowerCase().includes("apple"),
        ),
        "Expected at least one search result with 'apple' in its name",
      ).toBeTruthy();
    },
  );

  test(
    qase(29, "should return empty search result"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PRODUCTS, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api }) => {
      const response = await api.products.search("zzzzzzzz-no-such-product");

      expect(response.ok()).toBeTruthy();
      const body = await response.json();

      expect(body.data).toEqual([]);
    },
  );
});
