import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";
import { createTestAddress } from "@src/data/factories/addressFactory";

test.describe("Address API", () => {
  test(
    qase(9, "should create a new address"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.ADDRESS, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());
      const address = createTestAddress();

      const createdAddress = await api.address.create(auth.token, address);

      expect(createdAddress).toMatchObject({
        fullName: address.fullName,
        city: address.city,
        country: address.country,
      });
    },
  );

  test(
    qase(14, "should return empty address list for new user"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.ADDRESS, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const addresses = await api.address.getAll(auth.token);

      expect(addresses).toEqual([]);
    },
  );

  test(
    qase(18, "should not create address without authentication"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.ADDRESS, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api, apiResponse }) => {
      const response = await api.address.createResponse(
        "",
        createTestAddress(),
      );

      await apiResponse.expectUnauthorized(response, [401, 403]);
    },
  );
});
