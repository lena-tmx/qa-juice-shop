import { expect, test } from "../fixtures";
import { Tags } from "../attributes/tags";
import { createTestUser } from "@src/data/factories/userFactory";
import { TestData } from "@src/utils/TestData";

test.describe("Feedback API", () => {
  test(
    "should submit feedback with valid captcha",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.FEEDBACK, Tags.SCENARIO.POSITIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());
      const comment = TestData.getFeedbackComment();
      const rating = TestData.getRating();

      const response = await api.feedback.submitWithCaptcha(
        auth.token,
        comment,
        rating,
      );

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.data.comment).toBe(comment);
      expect(body.data.rating).toBe(rating);
    },
  );

  test(
    "should reject feedback without captcha",
    {
      tag: [Tags.TEST_TYPE.API, Tags.FEATURE.FEEDBACK, Tags.SCENARIO.NEGATIVE],
    },
    async ({ api }) => {
      const auth = await api.auth.registerAndLogin(createTestUser());

      const response = await api.feedback.submit(auth.token, {
        comment: TestData.getFeedbackComment(),
        rating: TestData.getRating(),
        captchaId: 0,
        captcha: "wrong",
      });
      const status = response.status();

      expect(
        [400, 401, 500].includes(status),
        `Expected error status, but got ${status}`,
      ).toBeTruthy();
    },
  );
});
