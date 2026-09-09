import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";
import { TestData } from "@src/utils/TestData";

test.describe("Feedback API", () => {
  test(
    qase(19, "should submit feedback with valid captcha"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.FEEDBACK, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());
      const comment = TestData.getFeedbackComment();
      const rating = TestData.getRating();

      const feedback = await api.feedback.submitWithCaptcha(
        auth.token,
        comment,
        rating,
      );

      expect(feedback).toMatchObject({ comment, rating });
    },
  );

  test(
    qase(
      69,
      "should reject feedback with an incorrect CAPTCHA answer — expects 401",
    ),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.FEEDBACK, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api, apiResponse }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const response = await api.feedback.submitResponse(auth.token, {
        comment: TestData.getFeedbackComment(),
        rating: TestData.getRating(),
        captchaId: 0,
        captcha: "wrong",
      });
      await apiResponse.expectUnauthorized(response);
    },
  );
});
