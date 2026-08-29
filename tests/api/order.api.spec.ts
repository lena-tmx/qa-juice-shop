import { qase } from 'playwright-qase-reporter';
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";
import { orderHistoryResponseSchema } from "@src/api/schemas/api.schemas";
import { parseApiResponse } from "@src/api/schemas/parseApiResponse";

test.describe("Order API", () => {
  test(
    qase(22, "should return empty order history for new user"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.ORDER_HISTORY, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const response = await api.order.getHistory(auth.token);

      expect(response.status()).toBe(200);
      const body = await parseApiResponse(
        response,
        orderHistoryResponseSchema,
      );
      expect(body.data).toEqual([]);
    },
  );

  test(
    qase(71, "should reject order history access without authentication"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.ORDER_HISTORY, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api }) => {
      const response = await api.order.getHistory("");
      const status = response.status();

      expect(
        [401, 403],
        `Expected 401 or 403, but got ${status}`,
      ).toContain(status);
    },
  );
});
