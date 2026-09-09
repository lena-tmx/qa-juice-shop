import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";

test.describe("Basket CRUD API", () => {
  test(
    qase(8, "should update basket item quantity"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const addedItem = await api.basket.addItem(auth.token, {
        ProductId: 1,
        BasketId: auth.basketId,
        quantity: 1,
      });

      expect(addedItem).toMatchObject({
        ProductId: 1,
        BasketId: auth.basketId,
        quantity: 1,
      });
      const itemId = addedItem.id;

      const updatedItem = await api.basket.updateItem(auth.token, itemId, 5);

      expect(updatedItem.quantity).toBe(5);
    },
  );

  test(
    qase(10, "should delete basket item"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ api, domain }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const addedItem = await api.basket.addItem(auth.token, {
        ProductId: 1,
        BasketId: auth.basketId,
        quantity: 1,
      });

      expect(addedItem).toMatchObject({
        ProductId: 1,
        BasketId: auth.basketId,
        quantity: 1,
      });
      const itemId = addedItem.id;

      await api.basket.deleteItem(auth.token, itemId);

      const basketItems = await api.basket.getBasketItems(auth.token);
      await domain.expectBasketItemAbsent(basketItems, itemId);
    },
  );

  test(
    qase(11, "should return basket by id"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const basket = await api.basket.getBasket(auth.basketId, auth.token);

      expect(basket.id).toBe(auth.basketId);
      expect(basket.Products).toBeDefined();
    },
  );
});
