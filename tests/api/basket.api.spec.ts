import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { createTestUser } from "@src/data/factories/userFactory";
import { Tags } from "../attributes/tags";

test.describe("Basket API", () => {
  test(
    qase(3, "Product is added to an authenticated user's basket"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const user = createTestUser();
      const login = await api.auth.registerAndLogin(user);
      const token = login.token;

      const basketItem = await api.basket.addItem(token, {
        ProductId: 1,
        BasketId: login.basketId,
        quantity: 1,
      });

      expect(basketItem).toMatchObject({
        ProductId: 1,
        BasketId: login.basketId,
        quantity: 1,
      });
    },
  );

  test(
    qase(65, "Product cannot be added to a basket without authentication"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api, apiResponse }) => {
      const response = await api.basket.addItemResponse("", {
        ProductId: 1,
        BasketId: 1,
        quantity: 1,
      });
      await apiResponse.expectUnauthorized(response);
    },
  );

  test(
    qase(6, "Basket items list contains the newly added product"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());
      const productId = 1;
      const quantity = 1;

      const addedItem = await api.basket.addItem(auth.token, {
        ProductId: productId,
        BasketId: auth.basketId,
        quantity,
      });

      expect(addedItem).toMatchObject({
        ProductId: productId,
        BasketId: auth.basketId,
        quantity,
      });

      const basketItems = await api.basket.getBasketItems(auth.token);

      expect(basketItems).toContainEqual(
        expect.objectContaining({
          id: addedItem.id,
          ProductId: productId,
          BasketId: auth.basketId,
          quantity,
        }),
      );
    },
  );
});
