import { qase } from "playwright-qase-reporter";
import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { TestData } from "@src/utils/TestData";

test.describe("Feedback API", () => {
  test(
    qase(19, "Feedback is submitted with a valid CAPTCHA answer"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.FEEDBACK, Tags.SCENARIO.POSITIVE],
    },
    async ({ authenticatedApi }) => {
      const { auth, services } = authenticatedApi;
      const comment = TestData.getFeedbackComment();
      const rating = TestData.getRating();

      const feedback = await services.feedback.submitWithCaptcha(
        auth.token,
        comment,
        rating,
      );

      expect(feedback).toMatchObject({ comment, rating });
    },
  );

  test(
    qase(69, "Feedback returns HTTP 401 for an invalid CAPTCHA answer"),
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.FEEDBACK, Tags.SCENARIO.NEGATIVE],
    },
    async ({ authenticatedApi, apiResponse }) => {
      const { auth, api } = authenticatedApi;

      const response = await api.feedback.submit(auth.token, {
        comment: TestData.getFeedbackComment(),
        rating: TestData.getRating(),
        captchaId: 0,
        captcha: "wrong",
      });
      await apiResponse.expectStatus(response, 401);
    },
  );
});
