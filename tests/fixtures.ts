import { test as base } from "@playwright/test";
import { Api } from "@src/api/endpoints";
import { Services } from "@src/api/services";
import type { AuthData } from "@src/api/types/auth.types";
import type { TestUser } from "@src/data/factories/userFactory";
import { PagesManager } from "@src/pages/PagesManager";
import { ApiResponseAssertions } from "./helpers/ApiResponseAssertions";
import { DomainAssertions } from "./helpers/DomainAssertions";
import { SearchSecurityWorkflow } from "./helpers/SearchSecurityWorkflow";

export interface AuthenticatedApi {
  user: TestUser;
  auth: AuthData;
  api: Api;
  services: Services;
}

export interface AuthenticatedUi {
  user: TestUser;
  pages: PagesManager;
}

type TestFixtures = {
  ui: PagesManager;
  authenticatedUi: AuthenticatedUi;
  api: Api;
  services: Services;
  registeredUser: TestUser;
  authenticatedApi: AuthenticatedApi;
  apiResponse: ApiResponseAssertions;
  searchSecurity: SearchSecurityWorkflow;
  domain: DomainAssertions;
};

export const test = base.extend<TestFixtures>({
  ui: [
    async ({ page }, use) => {
      await use(new PagesManager(page));
    },
    { title: "Prepare application pages" },
  ],

  api: [
    async ({ request }, use) => {
      await use(new Api(request));
    },
    { title: "Prepare API clients" },
  ],

  services: [
    async ({ api }, use) => {
      const services = new Services(api);
      await use(services);
      await services.cleanup();
    },
    { title: "Prepare business services and clean up test data" },
  ],

  registeredUser: [
    async ({ services }, use) => {
      const user = await services.auth.createTestUser();
      await use(user);
    },
    { title: "Create registered test user" },
  ],

  authenticatedApi: [
    async ({ api, services }, use) => {
      const user = await services.auth.createTestUser();
      const auth = await services.auth.login(user.email, user.password);
      await use({ user, auth, api, services });
    },
    { title: "Prepare authenticated API session" },
  ],

  authenticatedUi: [
    async ({ ui, registeredUser }, use) => {
      await ui.homePage.open();
      await ui.loginPage.open();
      await ui.loginPage.expectLoaded();
      await ui.loginPage.login(registeredUser.email, registeredUser.password);
      await ui.homePage.expectLoaded();
      await use({ user: registeredUser, pages: ui });
    },
    { title: "Prepare authenticated UI session" },
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
    async ({ page, ui, api }, use) => {
      await use(new SearchSecurityWorkflow(page, ui.homePage, api.products));
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
