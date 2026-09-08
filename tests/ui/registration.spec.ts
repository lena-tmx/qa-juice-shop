import { createTestUser } from "@src/data/factories/userFactory";
import { SecurityQuestions } from "@src/data/securityQuestions";
import { Tags } from "../attributes/tags";
import { test } from "../fixtures";

test.describe("Registration UI", () => {
  for (const securityQuestion of Object.values(SecurityQuestions)) {
    test(
      `should register a new user with security question ${securityQuestion.id}`,
      {
        tag: [
          Tags.TEST_TYPE.UI,
          Tags.FEATURE.REGISTRATION,
          Tags.SCENARIO.POSITIVE,
        ],
      },
      async ({ pages }) => {
        const user = createTestUser({
          securityQuestion,
        });

        await pages.registerPage.open();
        await pages.registerPage.expectLoaded();
        await pages.registerPage.register(user);
        await pages.registerPage.expectRegistrationSucceeded();

        await pages.loginPage.expectLoaded();
        await pages.loginPage.login(user.email, user.password);
        await pages.homePage.navbar.expectUserLoggedIn(user.email);
      },
    );
  }
});
