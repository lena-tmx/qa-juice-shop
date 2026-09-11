import { qase } from "playwright-qase-reporter";
import type { LoginResponse } from "@src/api/types/auth.types";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe("Auth API", () => {
  test(
    qase(4, "Login succeeds with valid credentials"),
    {
      tag: [
        Tags.TEST_TYPE.API,
        Tags.FEATURE.AUTH,
        Tags.TEST_TYPE.SMOKE,
        Tags.SCENARIO.POSITIVE,
      ],
    },
    async ({ api, apiResponse, registeredUser }) => {
      const response = await api.auth.login(
        registeredUser.email,
        registeredUser.password,
      );

      await apiResponse.expectStatus(response, 200);
      const body = (await response.json()) as LoginResponse;
      expect(body.authentication.token).toBeTruthy();
    },
  );

  test(
    qase(66, "Login returns HTTP 401 for an invalid password"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.AUTH, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api, apiResponse, registeredUser }) => {
      const response = await api.auth.login(
        registeredUser.email,
        "wrong-password",
      );
      await apiResponse.expectStatus(response, 401);
    },
  );
});
