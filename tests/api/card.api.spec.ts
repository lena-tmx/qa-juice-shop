import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";
import { createTestCard } from "@src/data/factories/cardFactory";

test.describe("Card API", () => {
  test(
    "should add a payment card",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PAYMENT, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());
      const card = createTestCard();

      const response = await api.card.create(auth.token, card);

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.data.fullName).toBe(card.fullName);
      expect(body.data.expMonth).toBe(card.expMonth);
    },
  );

  test(
    "should return empty card list for new user",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PAYMENT, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const response = await api.card.getAll(auth.token);

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data).toEqual([]);
    },
  );

  test(
    "should not add card without authentication",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.PAYMENT, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api }) => {
      const response = await api.card.create("", createTestCard());
      const status = response.status();

      expect(
        [401, 403].includes(status),
        `Expected 401 or 403, but got ${status}`,
      ).toBeTruthy();
    },
  );
});
