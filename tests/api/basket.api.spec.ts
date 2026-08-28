import { expect, test } from "../fixtures";
import { createTestUser } from "@src/data/factories/userFactory";
import { Tags } from "../attributes/tags";

test.describe("Basket API", () => {
  test(
    "should add item to basket for authorized user",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const user = createTestUser();
      const login = await api.auth.registerAndLogin(user);
      const token = login.token;

      const response = await api.basket.addItem(token, {
        ProductId: 1,
        BasketId: login.basketId,
        quantity: 1,
      });

      expect([200, 201]).toContain(response.status());
    },
  );

  test(
    "should reject adding basket item without an auth token — expects 401",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api }) => {
      const response = await api.basket.addItem("", {
        ProductId: 1,
        BasketId: 1,
        quantity: 1,
      });
      const status = response.status();

      expect(status, `Expected 401, but got ${status}`).toBe(401);
    },
  );

  test(
    "should return basket items list",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const user = createTestUser();
      const auth = await api.auth.registerAndLogin(user);

      const basketItems = await api.basket.getBasketItems(auth.token);

      expect(Array.isArray(basketItems)).toBeTruthy();
      expect(basketItems.length).toBeGreaterThanOrEqual(0);
    },
  );
});
