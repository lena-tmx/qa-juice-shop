import { qase } from 'playwright-qase-reporter';
import { expect, test } from "../fixtures";
import { createTestUser } from "@src/data/factories/userFactory";
import { Tags } from "../attributes/tags";

test.describe("Basket API", () => {
  test(
    qase(3, "should add item to basket for authorized user"),
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
    qase(65, "should reject adding basket item without an auth token — expects 401"),
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
    qase(6, "should return the added item in the basket items list"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());
      const productId = 1;
      const quantity = 1;

      const addResponse = await api.basket.addItem(auth.token, {
        ProductId: productId,
        BasketId: auth.basketId,
        quantity,
      });

      expect(addResponse.status()).toBe(200);
      const addBody = await addResponse.json();
      expect(addBody.data).toMatchObject({
        ProductId: productId,
        BasketId: auth.basketId,
        quantity,
      });

      const basketItems = await api.basket.getBasketItems(auth.token);

      expect(basketItems).toContainEqual(
        expect.objectContaining({
          id: addBody.data.id,
          ProductId: productId,
          BasketId: auth.basketId,
          quantity,
        }),
      );
    },
  );
});
