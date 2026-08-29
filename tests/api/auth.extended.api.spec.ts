import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";
import {
  securityQuestionsResponseSchema,
  userResponseSchema,
} from "@src/api/schemas/api.schemas";
import { parseApiResponse } from "@src/api/schemas/parseApiResponse";

test.describe("Auth Extended API", () => {
  test(
    qase(12, "should return security questions list"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.AUTH, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const response = await api.auth.getSecurityQuestions();

      expect(response.status()).toBe(200);
      const body = await parseApiResponse(
        response,
        securityQuestionsResponseSchema,
      );
      expect(body.data.length).toBeGreaterThan(0);
      expect(body.data[0].question).toBeTruthy();
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
      const response = await api.auth.register(user);

      expect([200, 201]).toContain(response.status());
      const body = await parseApiResponse(response, userResponseSchema);
      expect(body.data.email).toBe(user.email);
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
    async ({ api }) => {
      const user = createTestUser();
      await api.auth.registerOrThrow(user);

      const response = await api.auth.register(user);
      const status = response.status();

      expect(status, `Expected 400, but got ${status}`).toBe(400);
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

      const response = await api.auth.changePassword(
        auth.token,
        user.password,
        "NewSecurePass1!",
      );

      expect(response.status()).toBe(200);
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
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const response = await api.auth.changePassword(
        auth.token,
        "wrong-current-password",
        "NewPass1!",
      );
      const status = response.status();

      expect(status, `Expected 401, but got ${status}`).toBe(401);
    },
  );
});
