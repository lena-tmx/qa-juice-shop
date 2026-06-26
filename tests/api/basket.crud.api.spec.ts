import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";

test.describe("Basket CRUD API", () => {
  test(
    "should update basket item quantity",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const addResponse = await api.basket.addItem(auth.token, {
        ProductId: 1,
        BasketId: auth.basketId,
        quantity: 1,
      });
      const addBody = await addResponse.json();
      const itemId = addBody.data.id;

      const updateResponse = await api.basket.updateItem(
        auth.token,
        itemId,
        5,
      );

      expect(updateResponse.status()).toBe(200);
      const updateBody = await updateResponse.json();
      expect(updateBody.data.quantity).toBe(5);
    },
  );

  test(
    "should delete basket item",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const addResponse = await api.basket.addItem(auth.token, {
        ProductId: 1,
        BasketId: auth.basketId,
        quantity: 1,
      });
      const addBody = await addResponse.json();
      const itemId = addBody.data.id;

      const deleteResponse = await api.basket.deleteItem(auth.token, itemId);

      expect(deleteResponse.status()).toBe(200);
    },
  );

  test(
    "should return basket by id",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const response = await api.basket.getBasket(auth.basketId, auth.token);

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.id).toBe(auth.basketId);
      expect(body.data.Products).toBeDefined();
    },
  );
});
