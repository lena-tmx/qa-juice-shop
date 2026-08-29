import { test as base } from "@playwright/test";
import { ApiServices } from "@src/api/services";
import { PagesManager } from "@src/pages/PagesManager";
import type { TestUser } from "@src/data/factories/userFactory";

type TestFixtures = {
  pages: PagesManager;
  api: ApiServices;
  registeredUser: TestUser;
  authenticatedPages: PagesManager;
};

export const test = base.extend<TestFixtures>({
  pages: async ({ page }, use) => {
    await use(new PagesManager(page));
  },

  api: async ({ request }, use) => {
    await use(new ApiServices(request));
  },

  registeredUser: async ({ api }, use) => {
    const user = await api.auth.createTestUser();
    await use(user);
  },

  authenticatedPages: async ({ pages, registeredUser }, use) => {
    await pages.homePage.open();
    await pages.loginPage.open();
    await pages.loginPage.expectLoaded();
    await pages.loginPage.login(registeredUser.email, registeredUser.password);
    await pages.homePage.expectLoaded();
    await use(pages);
  },
});

export { expect } from "@playwright/test";
