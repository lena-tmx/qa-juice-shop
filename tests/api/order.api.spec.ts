import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe("Order API", () => {
  test(
    qase(22, "Order history is empty for a new user"),
    {
      tag: [
        Tags.TEST_TYPE.API,
        Tags.FEATURE.ORDER_HISTORY,
        Tags.SCENARIO.POSITIVE,
      ],
    },
    async ({ authenticatedApi }) => {
      const orders = await authenticatedApi.services.order.getHistory(
        authenticatedApi.auth.token,
      );

      expect(orders).toEqual([]);
    },
  );

  test(
    qase(71, "Order history cannot be accessed without authentication"),
    {
      tag: [
        Tags.TEST_TYPE.API,
        Tags.FEATURE.ORDER_HISTORY,
        Tags.SCENARIO.NEGATIVE,
      ],
    },
    async ({ api, apiResponse }) => {
      const response = await api.order.getHistory("");

      await apiResponse.expectStatus(response, 401);
    },
  );
});
