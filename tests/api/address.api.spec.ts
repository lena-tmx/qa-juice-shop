import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";
import { createTestAddress } from "@src/data/factories/addressFactory";

test.describe("Address API", () => {
  test(
    "should create a new address",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.ADDRESS, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());
      const address = createTestAddress();

      const response = await api.address.create(auth.token, address);

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.data.fullName).toBe(address.fullName);
      expect(body.data.city).toBe(address.city);
      expect(body.data.country).toBe(address.country);
    },
  );

  test(
    "should return empty address list for new user",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.ADDRESS, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const response = await api.address.getAll(auth.token);

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data).toEqual([]);
    },
  );

  test(
    "should not create address without authentication",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.ADDRESS, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api }) => {
      const response = await api.address.create("", createTestAddress());
      const status = response.status();

      expect(
        [401, 403].includes(status),
        `Expected 401 or 403, but got ${status}`,
      ).toBeTruthy();
    },
  );
});
