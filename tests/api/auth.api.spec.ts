import { qase } from 'playwright-qase-reporter';
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe("Auth API", () => {
  let user: { email: string; password: string };

  test.beforeAll("Create user via API", async ({ api }) => {
    user = await api.auth.createTestUser();
  });

  test(
    qase(4, "should login existing user"),
    {
      tag: [
        Tags.TEST_TYPE.API,
        Tags.FEATURE.AUTH,
        Tags.TEST_TYPE.SMOKE,
        Tags.SCENARIO.POSITIVE,
      ],
    },
    async ({ api }) => {
      const response = await api.auth.login(user.email, user.password);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.authentication).toBeDefined();
      expect(body.token || body.authentication.token).toBeTruthy();
    },
  );

  test(
    qase(66, "should reject login with incorrect password — expects 401"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.AUTH, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api }) => {
      const response = await api.auth.login(user.email, "wrong-password");
      const status = response.status();

      expect(status, `Expected 401, but got ${status}`).toBe(401);
    },
  );
});
