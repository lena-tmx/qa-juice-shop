import { qase } from "playwright-qase-reporter";
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe(`Login UI`, () => {
  test(
    qase(85, `Account menu displays the user after a successful login`),
    {
      tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.AUTH],
    },
    async ({ ui, registeredUser }) => {
      await ui.homePage.open();
      await ui.loginPage.open();
      await ui.loginPage.expectLoaded();
      await ui.loginPage.login(registeredUser.email, registeredUser.password);
      await ui.homePage.navbar.expectUserLoggedIn(registeredUser.email);
    },
  );

  test(
    qase(1, `Account menu displays the login option after logout`),
    {
      tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.AUTH],
    },
    async ({ ui, registeredUser }) => {
      await ui.homePage.open();
      await ui.loginPage.open();
      await ui.loginPage.expectLoaded();
      await ui.loginPage.login(registeredUser.email, registeredUser.password);
      await ui.homePage.navbar.expectUserLoggedIn(registeredUser.email);
      await ui.homePage.dismissBlockingBanners();
      await ui.homePage.navbar.logout();
      await ui.homePage.navbar.expectUserLoggedOut(registeredUser.email);
    },
  );
});
