import { qase } from 'playwright-qase-reporter';
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";
import { createTestCard } from "@src/data/factories/cardFactory";
import {
  cardListResponseSchema,
  cardResponseSchema,
} from "@src/api/schemas/api.schemas";
import { parseApiResponse } from "@src/api/schemas/parseApiResponse";

test.describe("Card API", () => {
  test(
    qase(13, "should add a payment card"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PAYMENT, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());
      const card = createTestCard();

      const response = await api.card.create(auth.token, card);

      expect(response.status()).toBe(201);
      const body = await parseApiResponse(response, cardResponseSchema);
      expect(body.data.fullName).toBe(card.fullName);
      expect(body.data.expMonth).toBe(card.expMonth);
    },
  );

  test(
    qase(15, "should return empty card list for new user"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PAYMENT, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const response = await api.card.getAll(auth.token);

      expect(response.status()).toBe(200);
      const body = await parseApiResponse(response, cardListResponseSchema);
      expect(body.data).toEqual([]);
    },
  );

  test(
    qase(67, "should reject adding a payment card without authentication — expects 401"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PAYMENT, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api }) => {
      const response = await api.card.create("", createTestCard());
      const status = response.status();

      expect(status, `Expected 401, but got ${status}`).toBe(401);
    },
  );
});
