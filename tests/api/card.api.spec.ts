import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";
import { createTestCard } from "@src/data/factories/cardFactory";

test.describe("Card API", () => {
  test(
    qase(13, "Payment card is added to an authenticated user's wallet"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PAYMENT, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());
      const card = createTestCard();

      const createdCard = await api.card.create(auth.token, card);

      expect(createdCard).toMatchObject({
        fullName: card.fullName,
        expMonth: card.expMonth,
      });
    },
  );

  test(
    qase(15, "Payment card list is empty for a new user"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PAYMENT, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const cards = await api.card.getAll(auth.token);

      expect(cards).toEqual([]);
    },
  );

  test(
    qase(67, "Payment card cannot be added without authentication"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PAYMENT, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api, apiResponse }) => {
      const response = await api.card.createResponse("", createTestCard());

      await apiResponse.expectUnauthorized(response);
    },
  );
});
