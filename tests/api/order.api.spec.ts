import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";

test.describe("Order API", () => {
  test(
    "should return empty order history for new user",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.ORDER_HISTORY, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const response = await api.order.getHistory(auth.token);

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data).toEqual([]);
    },
  );

  test(
    "should not return order history without authentication",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.ORDER_HISTORY, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api }) => {
      const response = await api.order.getHistory("");
      const status = response.status();

      expect(
        [401, 403, 500].includes(status),
        `Expected 401, 403, or 500, but got ${status}`,
      ).toBeTruthy();
    },
  );
});
