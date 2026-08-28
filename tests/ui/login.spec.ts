import { qase } from 'playwright-qase-reporter';
import { users } from "@src/data/users";
import { TestData } from "@src/utils/TestData";
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe(`Login UI`, () => {
  let newUser: { email: string; password: string };

  test.beforeAll("Register new user via API", async ({ api }) => {
    newUser = {
      email: TestData.getUniqueEmail(),
      password: users.validUser.password,
    };

    newUser = await api.auth.createTestUser();
  });

  test(
    qase(85, `should login existing user`),
    {
      tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.AUTH],
    },
    async ({ pages }) => {
      await pages.homePage.open();
      await pages.loginPage.open();
      await pages.loginPage.expectLoaded();
      await pages.loginPage.login(newUser.email, newUser.password);
      await pages.homePage.navbar.expectUserLoggedIn(newUser.email);
    },
  );

  test(
    qase(1, `should login and then logout successfully`),
    {
      tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.AUTH],
    },
    async ({ pages }) => {
      await pages.homePage.open();
      await pages.loginPage.open();
      await pages.loginPage.expectLoaded();
      await pages.loginPage.login(newUser.email, newUser.password);
      await pages.homePage.navbar.expectUserLoggedIn(newUser.email);
      await pages.homePage.navbar.logout();
      await pages.homePage.navbar.expectUserLoggedOut(newUser.email);
    },
  );
});
