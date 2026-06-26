import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";

test.describe("Auth Extended API", () => {
  test(
    "should return security questions list",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.AUTH, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const response = await api.auth.getSecurityQuestions();

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.length).toBeGreaterThan(0);
      expect(body.data[0].question).toBeTruthy();
    },
  );

  test(
    "should register a new user",
    {
      tag: [
        Tags.TEST_TYPE.API,
        Tags.FEATURE.REGISTRATION,
        Tags.SCENARIO.POSITIVE,
      ],
    },
    async ({ api }) => {
      const user = createTestUser();
      const response = await api.auth.register(user);

      expect([200, 201]).toContain(response.status());
      const body = await response.json();
      expect(body.data.email).toBe(user.email);
    },
  );

  test(
    "should not register user with duplicate email",
    {
      tag: [
        Tags.TEST_TYPE.API,
        Tags.FEATURE.REGISTRATION,
        Tags.SCENARIO.NEGATIVE,
      ],
    },
    async ({ api }) => {
      const user = createTestUser();
      await api.auth.registerOrThrow(user);

      const response = await api.auth.register(user);

      expect([400, 401, 422].includes(response.status())).toBeTruthy();
    },
  );

  test(
    "should change password",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.AUTH, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const user = createTestUser();
      const auth = await api.auth.registerAndLogin(user);

      const response = await api.auth.changePassword(
        auth.token,
        user.password,
        "NewSecurePass1!",
      );

      expect(response.status()).toBe(200);
    },
  );

  test(
    "should not change password with wrong current password",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.AUTH, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const response = await api.auth.changePassword(
        auth.token,
        "wrong-current-password",
        "NewPass1!",
      );
      const status = response.status();

      expect(
        [400, 401].includes(status),
        `Expected 400 or 401, but got ${status}`,
      ).toBeTruthy();
    },
  );
});
