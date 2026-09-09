import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";

test.describe("Auth Extended API", () => {
  test(
    qase(12, "should return security questions list"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.AUTH, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const securityQuestions = await api.auth.getSecurityQuestions();

      expect(securityQuestions.length).toBeGreaterThan(0);
      expect(securityQuestions[0].question).toBeTruthy();
    },
  );

  test(
    qase(17, "should register a new user"),
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
    qase(
      68,
      "should reject registration with an already-used email — expects 400",
    ),
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
    qase(27, "should change password"),
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
      "should reject password change with wrong current password — expects 401",
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
