import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestAddress } from "@src/data/factories/addressFactory";

test.describe("Address API", () => {
  test(
    qase(9, "Delivery address is added to an authenticated user's profile"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.ADDRESS, Tags.SCENARIO.POSITIVE],
    },
    async ({ authenticatedApi }) => {
      const { auth, services } = authenticatedApi;
      const address = createTestAddress();

      const createdAddress = await services.address.create(auth.token, address);

      expect(createdAddress).toMatchObject({
        fullName: address.fullName,
        city: address.city,
        country: address.country,
      });
    },
  );

  test(
    qase(14, "Address list is empty for a new user's profile"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.ADDRESS, Tags.SCENARIO.POSITIVE],
    },
    async ({ authenticatedApi }) => {
      const addresses = await authenticatedApi.services.address.getAll(
        authenticatedApi.auth.token,
      );

      expect(addresses).toEqual([]);
    },
  );

  test(
    qase(18, "Delivery address cannot be added without authentication"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.ADDRESS, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api, apiResponse }) => {
      const response = await api.address.create("", createTestAddress());

      await apiResponse.expectStatus(response, 401);
    },
  );
});
