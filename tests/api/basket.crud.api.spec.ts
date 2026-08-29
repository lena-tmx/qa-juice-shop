import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";
import {
  basketItemResponseSchema,
  basketResponseSchema,
} from "@src/api/schemas/api.schemas";
import { parseApiResponse } from "@src/api/schemas/parseApiResponse";

test.describe("Basket CRUD API", () => {
  test(
    qase(8, "should update basket item quantity"),
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

      expect(addResponse.status()).toBe(200);
      const addBody = await parseApiResponse(
        addResponse,
        basketItemResponseSchema,
      );
      expect(addBody.data).toMatchObject({
        ProductId: 1,
        BasketId: auth.basketId,
        quantity: 1,
      });
      const itemId = addBody.data.id;

      const updateResponse = await api.basket.updateItem(auth.token, itemId, 5);

      expect(updateResponse.status()).toBe(200);
      const updateBody = await parseApiResponse(
        updateResponse,
        basketItemResponseSchema,
      );
      expect(updateBody.data.quantity).toBe(5);
    },
  );

  test(
    qase(10, "should delete basket item"),
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

      expect(addResponse.status()).toBe(200);
      const addBody = await parseApiResponse(
        addResponse,
        basketItemResponseSchema,
      );
      expect(addBody.data).toMatchObject({
        ProductId: 1,
        BasketId: auth.basketId,
        quantity: 1,
      });
      const itemId = addBody.data.id;

      const deleteResponse = await api.basket.deleteItem(auth.token, itemId);

      expect(deleteResponse.status()).toBe(200);

      const basketItems = await api.basket.getBasketItems(auth.token);
      expect(basketItems.find((item) => item.id === itemId)).toBeUndefined();
    },
  );

  test(
    qase(11, "should return basket by id"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const response = await api.basket.getBasket(auth.basketId, auth.token);

      expect(response.status()).toBe(200);
      const body = await parseApiResponse(response, basketResponseSchema);
      expect(body.data.id).toBe(auth.basketId);
      expect(body.data.Products).toBeDefined();
    },
  );
});
