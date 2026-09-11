import { test as base } from "@playwright/test";
import { ApiServices } from "@src/api/services";
import { PagesManager } from "@src/pages/PagesManager";
import type { TestUser } from "@src/data/factories/userFactory";
import { ApiResponseAssertions } from "./helpers/ApiResponseAssertions";
import { SearchSecurityWorkflow } from "./helpers/SearchSecurityWorkflow";
import { DomainAssertions } from "./helpers/DomainAssertions";

type TestFixtures = {
  pages: PagesManager;
  api: ApiServices;
  registeredUser: TestUser;
  authenticatedPages: PagesManager;
  apiResponse: ApiResponseAssertions;
  searchSecurity: SearchSecurityWorkflow;
  domain: DomainAssertions;
};

export const test = base.extend<TestFixtures>({
  pages: [
    async ({ page }, use) => {
      await use(new PagesManager(page));
    },
    { title: "Prepare application pages" },
  ],

  api: [
    async ({ request }, use) => {
      const services = new ApiServices(request);
      await use(services);
      await services.cleanup();
    },
    { title: "Prepare API services and clean up test users" },
  ],

  registeredUser: [
    async ({ api }, use) => {
      const user = await api.auth.createTestUser();
      await use(user);
    },
    { title: "Create registered test user" },
  ],

  authenticatedPages: [
    async ({ pages, registeredUser }, use) => {
      await pages.homePage.open();
      await pages.loginPage.open();
      await pages.loginPage.expectLoaded();
      await pages.loginPage.login(
        registeredUser.email,
        registeredUser.password,
      );
      await pages.homePage.expectLoaded();
      await use(pages);
    },
    { title: "Open authenticated user session" },
  ],

  apiResponse: [
    // Playwright requires an object pattern even when a fixture has no dependencies.
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await use(new ApiResponseAssertions());
    },
    { title: "Prepare API response assertions" },
  ],

  searchSecurity: [
    async ({ page, pages, api }, use) => {
      await use(new SearchSecurityWorkflow(page, pages.homePage, api.products));
    },
    { title: "Prepare search security workflow" },
  ],

  domain: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await use(new DomainAssertions());
    },
    { title: "Prepare domain assertions" },
  ],
});

export { expect } from "@playwright/test";
