import { createTestUser } from "@src/data/factories/userFactory";
import { SecurityQuestions } from "@src/data/securityQuestions";
import { Tags } from "../attributes/tags";
import { test } from "../fixtures";

test.describe("Registration UI", () => {
  for (const securityQuestion of Object.values(SecurityQuestions)) {
    test(
      `User registration and login succeed with security question ${securityQuestion.id}`,
      {
        tag: [
          Tags.TEST_TYPE.UI,
          Tags.FEATURE.REGISTRATION,
          Tags.SCENARIO.POSITIVE,
        ],
      },
      async ({ ui }) => {
        const user = createTestUser({
          securityQuestion,
        });

        await ui.registerPage.open();
        await ui.registerPage.expectLoaded();
        await ui.registerPage.register(user);
        await ui.registerPage.expectRegistrationSucceeded();

        await ui.loginPage.expectLoaded();
        await ui.loginPage.login(user.email, user.password);
        await ui.homePage.navbar.expectUserLoggedIn(user.email);
      },
    );
  }
});
