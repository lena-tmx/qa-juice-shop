import { qase } from "playwright-qase-reporter";
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe(`Login UI`, () => {
  test(
    qase(85, `Account menu displays the user after a successful login`),
    {
      tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.AUTH],
    },
    async ({ pages, registeredUser }) => {
      await pages.homePage.open();
      await pages.loginPage.open();
      await pages.loginPage.expectLoaded();
      await pages.loginPage.login(
        registeredUser.email,
        registeredUser.password,
      );
      await pages.homePage.navbar.expectUserLoggedIn(registeredUser.email);
    },
  );

  test(
    qase(1, `Account menu displays the login option after logout`),
    {
      tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.AUTH],
    },
    async ({ pages, registeredUser }) => {
      await pages.homePage.open();
      await pages.loginPage.open();
      await pages.loginPage.expectLoaded();
      await pages.loginPage.login(
        registeredUser.email,
        registeredUser.password,
      );
      await pages.homePage.navbar.expectUserLoggedIn(registeredUser.email);
      await pages.homePage.dismissBlockingBanners();
      await pages.homePage.navbar.logout();
      await pages.homePage.navbar.expectUserLoggedOut(registeredUser.email);
    },
  );
});
