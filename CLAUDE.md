# CLAUDE.md

## Project Overview

This is a portfolio-grade QA Automation project for OWASP Juice Shop.

The project demonstrates:

- UI automation with Playwright
- API testing with a service layer
- Security testing (OWASP Top 10)
- Allure reporting with step decorator
- GitHub Actions CI with reusable workflows
- Page Object Model with PagesManager
- Test data factories
- Future AI-assisted test generation

## Tech Stack

- TypeScript
- Playwright
- Allure Playwright
- GitHub Actions
- Docker Compose
- OWASP Juice Shop

## Project Structure

```text
tests/
  ui/              # UI tests (login, search, basket)
  api/             # API tests (auth, products, basket)
  security/        # Security tests (IDOR, XSS, access control)
  attributes/
    tags.ts         # Tag constants for test categorization
  fixtures.ts      # Custom test fixtures (pages, api)

src/
  pages/           # Page Objects (BasePage, HomePage, LoginPage, BasketPage, AccountPage)
    PagesManager.ts # Lazy-init registry for all page objects
  components/
    Navbar.ts       # Shared navbar component
  elements/
    BaseElement.ts  # Base class for reusable UI elements
    Menu.ts         # Dropdown menu element
  modals/
    BaseBanner.ts   # Base class for dismissable banners
    CookieBanner.ts
    WelcomeBanner.ts
  api/
    clients/
      ApiClient.ts  # Base HTTP client (get/post/put/delete)
    services/       # Business-level API wrappers
      AuthService.ts
      ProductsService.ts
      BasketService.ts
      index.ts      # ApiServices aggregator
    types/          # Request/response type definitions
  data/
    users.ts        # Static user data
    products.ts     # Static product data
    securityQuestions.ts
    factories/
      userFactory.ts # createTestUser() factory
  utils/
    env.ts          # Environment config (BASE_URL, TAGS_FILTER, CI)
    step.ts         # @step() decorator for Allure
    TestData.ts     # Helpers (getUniqueEmail)

allure/             # Allure metadata (categories.json, environment.properties)
.github/workflows/  # CI workflows
```

## Local Setup

```bash
# Start Juice Shop
docker compose up -d

# Install dependencies
npm install

# Run all tests (chromium)
npm test

# Run by suite
npm run test:ui
npm run test:api
npm run test:security

# Run by tag
npm run test:smoke
npm run test:auth
npm run test:search
npm run test:basket

# Run headed / debug
npm run test:headed
npm run test:debug

# Allure report
npm run test:allure
npm run allure:generate
npm run allure:open
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `http://localhost:3000` | Juice Shop base URL |
| `TAGS_FILTER` | _(empty)_ | Comma-separated tags to filter tests (e.g. `idor,xss`) |
| `CI` | `false` | Enables CI-specific behavior (trace on failure, video off) |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` | _(auto)_ | Override Chrome binary path (used in CI) |

## Path Aliases

Configured in `tsconfig.json`:

```ts
import { something } from "@src/utils/step";   // → src/utils/step.ts
import { something } from "@tests/fixtures";    // → tests/fixtures.ts
```

## Git Rules

Never commit or push to the `main` branch without explicit user confirmation. Always ask before running `git commit`, `git push`, or any destructive git operation (`reset --hard`, `push --force`, `branch -D`). A single approval does not carry over — confirm each time.

For feature work, prefer creating a separate branch and opening a PR.

## Repository Rules

Use the existing architecture.

Do not write raw Playwright API calls directly in tests when a Page Object or API Service exists.

Prefer:

```ts
await api.auth.login(...)
await basketPage.expectProductInBasket(...)
await homePage.expectLoaded()
```

Avoid:

```ts
await request.post(...)
await page.locator(...)
```

unless creating or improving Page Objects, components, modals, or services.

## Fixtures Rules

Always import `test` and `expect` from the custom fixtures file, not from `@playwright/test`:

```ts
// Correct
import { test, expect } from "../fixtures";

// Wrong
import { test, expect } from "@playwright/test";
```

Custom fixtures provide:

- `pages` — `PagesManager` instance with lazy access to all page objects
- `api` — `ApiServices` instance with access to all API services

## Page Object Rules

Each page object must expose:

```ts
expectLoaded();
```

Use generic page-level naming:

```ts
homePage.expectLoaded();
loginPage.expectLoaded();
basketPage.expectLoaded();
```

Avoid:

```ts
expectHomeLoaded();
expectLoginPageLoaded();
expectBasketLoaded();
```

New page objects must:

1. Extend `BasePage`
2. Accept `Page` in constructor
3. Include a `Navbar` if the page has one
4. Be registered in `PagesManager` with a lazy getter

## Components and Elements

**Navbar** — shared component available on most pages via `page.navbar`.

**Menu** — reusable dropdown element wrapping Angular Material menus. Handles open/close state and item selection.

**BaseElement** — base class for custom elements. Holds a `page` reference.

**BaseBanner** — abstract base for dismissable modals (welcome banner, cookie banner). Provides `isShown()`, `waitUntilGone()`, `clickAndWaitToDisappear()`.

## API Layer Rules

All API calls should go through services.

Existing services:

- `AuthService` — register, login, createTestUser, registerAndLogin
- `ProductsService` — getAll, search
- `BasketService` — addItem, getBasket, getBasketItems

Preferred usage:

```ts
api.auth.register(...)
api.auth.login(...)
api.products.search(...)
api.basket.addItem(...)
```

Avoid raw `request.get()` or `request.post()` in tests.

New services must:

1. Extend `ApiClient`
2. Accept `APIRequestContext` in constructor
3. Be registered in `ApiServices` (index.ts)

## Test Data Rules

Use data files and factories.

Preferred:

```ts
const user = createTestUser();
SecurityQuestions.MOTHERS_BIRTH_DATE.id;
products.carrotJuice.name;
```

Avoid hardcoded emails, passwords, product names, security question IDs, or basket IDs in tests.

## Tags Rules

Every test must have tags. Use the `Tags` class from `tests/attributes/tags.ts`.

Required tags:

- At least one `TEST_TYPE` tag (`@ui`, `@api`, `@security`, `@smoke`)
- At least one `FEATURE` tag (`@auth`, `@search`, `@basket`, `@products`, etc.)

Optional tags:

- `SCENARIO` — `@positive`, `@negative`
- `PRIORITY` — `@critical`

Usage:

```ts
test(
  "should do something",
  { tag: [Tags.TEST_TYPE.API, Tags.FEATURE.AUTH, Tags.SCENARIO.POSITIVE] },
  async ({ api }) => { ... },
);
```

## Step Decorator Rules

Use `@step()` on Page Object and service methods for Allure reporting.

Static step name:

```ts
@step("Open login page")
async open(): Promise<void> { ... }
```

Dynamic step name with arguments:

```ts
@step((productName: string) => `Add product to basket: ${productName}`)
async addProductToBasket(productName: string): Promise<void> { ... }
```

No-arg form uses `ClassName.methodName` automatically:

```ts
@step()
async closeIfVisible(): Promise<void> { ... }
```

Avoid wrapping every small locator action in a step. Use steps for meaningful business actions.

## Language Rules

All code-level text must be in English. This includes:

- Code comments
- Variable, function, and class names
- Test titles and `test.describe` group names
- Allure `@step()` descriptions
- Commit messages and PR descriptions
- Documentation files (README.md, docs/, reports/)
- CI workflow names and log messages

No exceptions — the codebase is English-only.

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Test file | `<feature>.spec.ts` or `<feature>.<type>.spec.ts` | `login.spec.ts`, `auth.api.spec.ts`, `xss.security.spec.ts` |
| Page Object | `<Name>Page.ts` | `LoginPage.ts`, `BasketPage.ts` |
| API Service | `<Name>Service.ts` | `AuthService.ts`, `ProductsService.ts` |
| API Types | `<name>.types.ts` | `auth.types.ts`, `basket.types.ts` |
| Component | `<Name>.ts` | `Navbar.ts` |
| Element | `<Name>.ts` | `Menu.ts` |
| Modal/Banner | `<Name>Banner.ts` | `WelcomeBanner.ts`, `CookieBanner.ts` |
| Factory | `<name>Factory.ts` | `userFactory.ts` |

## Security Testing Rules

Security tests live in:

```text
tests/security/
```

Security tests should be explicit about the vulnerability category.

Examples:

- Broken Access Control
- IDOR
- Authentication Failure
- User Enumeration
- Input Validation
- XSS

Security tests should not only check happy paths.

For expected secure behavior, prefer:

```ts
expect(
  [401, 403].includes(status),
  `Expected 401 or 403, got ${status}`,
).toBeTruthy();
```

## UI Stability Rules

Do not use:

```ts
waitForTimeout();
```

Prefer waiting for:

- response
- locator visibility
- URL change
- network state only when justified

For basket operations, wait for:

```ts
POST /api/BasketItems
```

before asserting that the UI updated.

## Banner Handling

Cookie banner and welcome banner should be handled through reusable banner classes.

Existing banners:

- BaseBanner
- CookieBanner
- WelcomeBanner

Banner dismissal is built into `BasePage.dismissBlockingBanners()` and called automatically by page objects in `open()` and `expectLoaded()`.

## Allure Rules

Use `@step()` decorator for meaningful business actions.

Good step examples:

- Register test user
- Login as user
- Add product to basket
- Try to access another user's basket
- Verify access is denied

Avoid wrapping every small locator action in an Allure step.

## Pre-Commit Checklist

Before every commit, verify:

1. **README.md is up to date** — if you added/removed tests, pages, services, commands, or changed project structure, update README.md to reflect the current state
2. **TypeScript compiles** — run `npx tsc --noEmit`
3. **Tests pass** — run `npm test` or the relevant suite
4. **No hardcoded test data** — use factories and data files
5. **Tags are present** — every new test has at least `TEST_TYPE` and `FEATURE` tags
6. **`@step()` decorators** — new Page Object / service methods have meaningful step names
7. **Fixtures import** — tests import from `"../fixtures"`, not from `"@playwright/test"`
8. **No dead code** — remove commented-out blocks, unused imports, empty files

## Test Isolation Rules

- Each test must be independent and not rely on state from other tests
- Use `test.beforeEach` (not `test.beforeAll`) for per-test setup when using fixtures like `api` or `pages` — these are per-test scoped in Playwright
- `test.beforeAll` is acceptable only for truly shared setup that does not use per-test fixtures
- Always create fresh test users via `createTestUser()` or `api.auth.createTestUser()` instead of reusing static credentials across tests
- Clean up created state when possible or rely on unique data to avoid collisions

## Locator Best Practices

Prefer locators in this priority order:

1. `getByRole()` — accessible roles (button, heading, textbox, link)
2. `getByLabel()` — form inputs with labels
3. `getByText()` — visible text content
4. `getByTestId()` — `data-testid` attributes (when available)
5. CSS selectors — only when semantic locators are not practical

Avoid:

- XPath selectors
- Fragile CSS chains like `div > div > span:nth-child(3)`
- Index-based selectors like `.items:first-child` unless scoped to a known container

When filtering within a container, use `.filter()` or `.locator()` chaining:

```ts
page.locator("mat-row").filter({
  has: page.locator("mat-cell", { hasText: productName }),
});
```

## Error Messages in Assertions

For security and API tests, always include a descriptive error message in assertions:

```ts
expect(
  [401, 403].includes(status),
  `Expected 401 or 403, but got ${status}`,
).toBeTruthy();
```

For UI tests, Playwright's built-in assertion messages are usually sufficient.

## Flaky Test Prevention

- Never use `waitForTimeout()` — wait for a specific condition instead
- For actions that trigger API calls, wait for the response before asserting UI state
- Use `expect(...).toBeVisible()` before interacting with elements
- Use `.toHaveCount(0)` instead of `.not.toBeVisible()` when checking element removal
- If a test is flaky, fix the root cause — do not add retries as a workaround

## AI Agent Rules

AI-generated code must follow the existing project structure.

The agent may create:

- test plans
- crawler reports
- draft `.spec.ts` files
- draft Page Objects
- draft API services

The agent must not silently replace existing architecture.

Generated tests must be validated by running:

```bash
npm test
```

or a specific suite command before committing.

## Crawler Agent Goal

The crawler agent should collect information only.

It should not generate tests yet.

Crawler output should include:

- visited pages
- page titles
- URLs
- forms
- buttons
- links
- important locators
- detected API calls
- possible user flows

Crawler reports should be saved under:

```text
reports/crawler/
```

## Current Development Priorities

1. Clean up dead code (example.spec.ts, commented-out AuthApi.ts, old.playwright.config.ts)
2. Fix typo: `BasketSrvice.ts` -> `BasketService.ts`
3. Fill empty `auth.security.spec.ts` with authentication security tests
4. Expand security test coverage (SQL injection, broken auth, security headers)
5. Add missing Page Objects (RegistrationPage, ProductDetailPage)
6. Add crawler agent
7. Generate crawler reports
8. Later: analyzer agent
9. Later: generator agent
10. Later: validator agent
