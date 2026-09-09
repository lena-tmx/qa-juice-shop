import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";
import { SecurityQuestions } from "@src/data/securityQuestions";

test.describe("Extended Authentication API", () => {
  test(
    qase(12, "Security questions API returns all supported options"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.AUTH, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const securityQuestions = await api.auth.getSecurityQuestions();
      const expectedQuestions = Object.values(SecurityQuestions).map(
        ({ text }) => text,
      );
      const actualQuestions = securityQuestions.map(({ question }) => question);

      expect(actualQuestions).toHaveLength(expectedQuestions.length);
      expect(actualQuestions).toEqual(
        expect.arrayContaining(expectedQuestions),
      );
    },
  );

  test(
    qase(17, "User registration succeeds with a unique email"),
    {
      tag: [
        Tags.TEST_TYPE.API,
        Tags.FEATURE.REGISTRATION,
        Tags.SCENARIO.POSITIVE,
      ],
    },
    async ({ api }) => {
      const user = createTestUser();
      const registeredUser = await api.auth.register(user);

      expect(registeredUser.email).toBe(user.email);
    },
  );

  test(
    qase(68, "User registration returns HTTP 400 for an existing email"),
    {
      tag: [
        Tags.TEST_TYPE.API,
        Tags.FEATURE.REGISTRATION,
        Tags.SCENARIO.NEGATIVE,
      ],
    },
    async ({ api, apiResponse }) => {
      const user = createTestUser();
      await api.auth.register(user);

      const response = await api.auth.registerResponse(user);

      await apiResponse.expectStatus(response, 400);
    },
  );

  test(
    qase(27, "Password change allows login with the new password"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.AUTH, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const user = createTestUser();
      const auth = await api.auth.registerAndLogin(user);

      await api.auth.changePassword(
        auth.token,
        user.password,
        "NewSecurePass1!",
      );
      const authWithNewPassword = await api.auth.login(
        user.email,
        "NewSecurePass1!",
      );

      expect(authWithNewPassword.token).toBeTruthy();
    },
  );

  test(
    qase(
      72,
      "Password change returns HTTP 401 for an invalid current password",
    ),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.AUTH, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api, apiResponse }) => {
      const user = createTestUser();
      const auth = await api.auth.registerAndLogin(user);

      const response = await api.auth.changePasswordResponse(
        auth.token,
        "wrong-current-password",
        "NewPass1!",
      );
      await apiResponse.expectUnauthorized(response);

      const unchangedAuth = await api.auth.login(user.email, user.password);
      expect(unchangedAuth.token).toBeTruthy();
    },
  );
});
