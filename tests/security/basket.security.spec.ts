import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { createTestUser } from "@src/data/factories/userFactory";
import { Tags } from "../attributes/tags";

test.describe("Broken Access Control", () => {
  test(
    qase(
      36,
      "should not allow accessing arbitrary basket by id without auth (IDOR)",
    ),
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
    async ({ api }) => {
      const response = await api.basket.getBasket(1);

      const status = response.status();
      expect(status, `Expected 401, but got ${status}`).toBe(401);
    },
  );

  test(
    "should not allow one user to access another user's basket (IDOR)",
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
    async ({ api }) => {
      const user1 = createTestUser();
      const auth1 = await api.auth.registerAndLogin(user1);

      const user2 = createTestUser();
      const auth2 = await api.auth.registerAndLogin(user2);

      const response = await api.basket.getBasket(auth1.basketId, auth2.token);

      const status = response.status();
      /**
       * Expected (secure) behavior: 401, matching this app's own pattern for
       * unauthorized basket access (see sibling test above). The app is
       * currently vulnerable and returns 200 here — that's the bug this
       * test exists to catch, not a flaky assertion.
       */
      expect(status, `Expected 401, but got ${status}`).toBe(401);
    },
  );

  test(
    qase(
      41,
      "should not allow one user to add item into another user's basket",
    ),
    {
      tag: [
        Tags.TEST_TYPE.SECURITY,
        Tags.TEST_TYPE.API,
        Tags.FEATURE.BASKET,
        Tags.FEATURE.ACCESS_CONTROL,
        Tags.PRIORITY.CRITICAL,
      ],
    },
    async ({ api }) => {
      const user1 = createTestUser();
      const auth1 = await api.auth.registerAndLogin(user1);

      const user2 = createTestUser();
      const auth2 = await api.auth.registerAndLogin(user2);

      const response = await api.basket.addItem(auth1.token, {
        ProductId: 1,
        BasketId: auth2.basketId,
        quantity: 1,
      });

      const status = response.status();
      expect(status, `Expected 401, but got ${status}`).toBe(401);
    },
  );
});
