import { qase } from "playwright-qase-reporter";
import { test } from "../fixtures";
import { createTestUser } from "@src/data/factories/userFactory";
import { Tags } from "../attributes/tags";

test.describe("Broken Access Control", () => {
  test(
    qase(36, "Basket cannot be accessed by identifier without authentication"),
    {
      tag: [
        Tags.TEST_TYPE.SECURITY,
        Tags.TEST_TYPE.API,
        Tags.FEATURE.BASKET,
        Tags.FEATURE.ACCESS_CONTROL,
        Tags.FEATURE.IDOR,
        Tags.PRIORITY.CRITICAL,
      ],
    },
    async ({ api, apiResponse }) => {
      const response = await api.basket.getBasket(1);

      await apiResponse.expectStatus(response, 401);
    },
  );

  test(
    qase(96, "User cannot access another user's basket by identifier"),
    {
      tag: [
        Tags.TEST_TYPE.SECURITY,
        Tags.TEST_TYPE.API,
        Tags.FEATURE.BASKET,
        Tags.FEATURE.ACCESS_CONTROL,
        Tags.FEATURE.IDOR,
        Tags.PRIORITY.CRITICAL,
      ],
    },
    async ({ api, services, apiResponse }) => {
      const user1 = createTestUser();
      const auth1 = await services.auth.registerAndLogin(user1);

      const user2 = createTestUser();
      const auth2 = await services.auth.registerAndLogin(user2);

      const response = await api.basket.getBasket(auth1.basketId, auth2.token);

      /**
       * Expected (secure) behavior: 401, matching this app's own pattern for
       * unauthorized basket access (see sibling test above). The app is
       * currently vulnerable and returns 200 here — that's the bug this
       * test exists to catch, not a flaky assertion.
       */
      await apiResponse.expectStatus(response, 401);
    },
  );

  test(
    qase(41, "User cannot add a product to another user's basket"),
    {
      tag: [
        Tags.TEST_TYPE.SECURITY,
        Tags.TEST_TYPE.API,
        Tags.FEATURE.BASKET,
        Tags.FEATURE.ACCESS_CONTROL,
        Tags.PRIORITY.CRITICAL,
      ],
    },
    async ({ api, services, apiResponse }) => {
      const user1 = createTestUser();
      const auth1 = await services.auth.registerAndLogin(user1);

      const user2 = createTestUser();
      const auth2 = await services.auth.registerAndLogin(user2);

      const response = await api.basket.addItem(auth1.token, {
        ProductId: 1,
        BasketId: auth2.basketId,
        quantity: 1,
      });

      await apiResponse.expectStatus(response, 401);
    },
  );
});
