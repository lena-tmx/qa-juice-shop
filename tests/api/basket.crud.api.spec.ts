import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe("Basket Management API", () => {
  test(
    qase(8, "Basket item quantity changes to the requested value"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ authenticatedApi }) => {
      const { auth, services } = authenticatedApi;

      const addedItem = await services.basket.addItem(auth.token, {
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

      const updatedItem = await services.basket.updateItem(
        auth.token,
        itemId,
        5,
      );

      expect(updatedItem.quantity).toBe(5);
    },
  );

  test(
    qase(10, "Basket no longer contains an item after removal"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ authenticatedApi, domain }) => {
      const { auth, services } = authenticatedApi;

      const addedItem = await services.basket.addItem(auth.token, {
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

      await services.basket.deleteItem(auth.token, itemId);

      const basketItems = await services.basket.getItems(auth.token);
      await domain.expectBasketItemAbsent(basketItems, itemId);
    },
  );

  test(
    qase(11, "Basket API returns the requested basket by identifier"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ authenticatedApi }) => {
      const { auth, services } = authenticatedApi;

      const basket = await services.basket.getBasket(auth.basketId, auth.token);

      expect(basket.id).toBe(auth.basketId);
      expect(basket.Products).toBeDefined();
    },
  );
});
