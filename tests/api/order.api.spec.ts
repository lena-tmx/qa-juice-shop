import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";

test.describe("Order API", () => {
  test(
    qase(22, "should return empty order history for new user"),
    {
      tag: [
        Tags.TEST_TYPE.API,
        Tags.FEATURE.ORDER_HISTORY,
        Tags.SCENARIO.POSITIVE,
      ],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const orders = await api.order.getHistory(auth.token);

      expect(orders).toEqual([]);
    },
  );

  test(
    qase(71, "should reject order history access without authentication"),
    {
      tag: [
        Tags.TEST_TYPE.API,
        Tags.FEATURE.ORDER_HISTORY,
        Tags.SCENARIO.NEGATIVE,
      ],
    },
    async ({ api, apiResponse }) => {
      const response = await api.order.getHistoryResponse("");

      await apiResponse.expectUnauthorized(response, [401, 403]);
    },
  );
});
