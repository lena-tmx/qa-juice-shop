import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe("Auth API", () => {
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
    async ({ api, registeredUser }) => {
      const auth = await api.auth.login(
        registeredUser.email,
        registeredUser.password,
      );

      expect(auth.token).toBeTruthy();
    },
  );

  test(
    qase(66, "should reject login with incorrect password — expects 401"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.AUTH, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api, apiResponse, registeredUser }) => {
      const response = await api.auth.loginResponse(
        registeredUser.email,
        "wrong-password",
      );
      await apiResponse.expectUnauthorized(response);
    },
  );
});
