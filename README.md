![Tests](https://github.com/LenaChe-1234/qa-juice-shop/actions/workflows/playwright.yml/badge.svg)

# qa-juice-shop

End-to-end Playwright automation framework for OWASP Juice Shop
covering UI, API, and security-focused testing, with CI/CD and Allure reporting.

## Overview

This repository contains a custom Playwright-based test framework for testing the Juice Shop application.
It covers UI, API, and security-focused scenarios and includes reusable fixtures, service layers, tag-based filtering, and reporting support.

## What this project demonstrates

- Building a Playwright + TypeScript automation framework from scratch
- UI, API, and security-focused test design
- Reusable page objects, components, modals, fixtures, and service layers
- Docker-based local environment setup
- GitHub Actions CI execution with Playwright Docker image
- Allure reporting and test result visualization
- AI-assisted test generation via Playwright MCP
- Automated test result analysis with flaky test detection
- Feature, route, and API coverage tracking

## Tech stack

- TypeScript
- Playwright
- Playwright MCP
- Allure Playwright
- Docker Compose
- GitHub Actions
- dotenv

## Project structure

The repository is organized into framework code and test suites.

### Main directories

- [src/pages](src/pages) page objects for UI interactions
- [src/components](src/components) reusable UI components used by pages
- [src/modals](src/modals) modal and banner objects
- [src/api/clients](src/api/clients) low-level API client logic
- [src/api/services](src/api/services) high-level domain API services
- [src/data](src/data) test data and data factories
- [src/utils](src/utils) framework utilities such as environment parsing and step decorators
- [src/agents/analyzer](src/agents/analyzer) test result analyzer with flaky detection
- [src/agents/coverage](src/agents/coverage) feature, route, and API coverage tracker
- [tests/ui](tests/ui) UI test suite
- [tests/api](tests/api) API test suite
- [tests/security](tests/security) security-focused test suite
- [tests/attributes](tests/attributes) shared test metadata such as tags
- [tests/fixtures.ts](tests/fixtures.ts) custom Playwright fixtures exposed to tests

### Key framework files

- [playwright.config.ts](playwright.config.ts) Playwright configuration, reporters, projects, and tag filtering
- [src/utils/env.ts](src/utils/env.ts) environment variable parsing and normalization
- [src/utils/step.ts](src/utils/step.ts) decorator for wrapping methods with `test.step`
- [tests/attributes/tags.ts](tests/attributes/tags.ts) central storage for reusable test tags
- [docker-compose.yml](docker-compose.yml) local Juice Shop container setup
- [.mcp.json](.mcp.json) Playwright MCP server configuration for Claude Code

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start Juice Shop

Start the local application with Docker:

```bash
npm run docker:up
```

The app will be available at `http://localhost:3000`.

Stop and clean the container when needed:

```bash
npm run docker:down
```

### 3. Configure environment variables

Create or update `.env`:

```dotenv
BASE_URL=http://localhost:3000
TAGS_FILTER=
CI=false
```

### Environment variables

- `BASE_URL` base URL of the tested application
- `TAGS_FILTER` optional comma-separated list of tags for test filtering
- `CI` CI mode flag (enables retries, JSON reporter)

## Running tests

### Main commands

```bash
npm test
npm run test:ci
npm run test:ui
npm run test:api
npm run test:security
```

### Browser-specific commands

```bash
npm run test:chromium
npm run test:firefox
```

### Debugging commands

```bash
npm run test:headed
npm run test:debug
```

### Quick filtered commands

```bash
npm run test:smoke
npm run test:auth
npm run test:search
npm run test:basket
```

## Main test coverage

The project currently includes three main groups of automated tests.

### UI tests

UI scenarios validate critical end-user flows in the browser:

- [tests/ui/login.spec.ts](tests/ui/login.spec.ts) login with a valid user and successful logout
- [tests/ui/search.spec.ts](tests/ui/search.spec.ts) product search and empty-state handling for missing results
- [tests/ui/basket.spec.ts](tests/ui/basket.spec.ts) add-to-basket flow, basket visibility, item removal, and empty basket checks

### API tests

API scenarios cover the main backend business flows:

- [tests/api/auth.api.spec.ts](tests/api/auth.api.spec.ts) successful login and rejection of invalid credentials
- [tests/api/products.api.spec.ts](tests/api/products.api.spec.ts) product catalog retrieval, positive search, and empty search results
- [tests/api/basket.api.spec.ts](tests/api/basket.api.spec.ts) authorized basket updates, unauthorized add attempts, and basket item retrieval

### Security tests

Security-oriented scenarios check common vulnerable areas in Juice Shop:

- [tests/security/basket.security.spec.ts](tests/security/basket.security.spec.ts) broken access control and IDOR checks around basket access and basket modification
- [tests/security/xss.security.spec.ts](tests/security/xss.security.spec.ts) reflected payload handling in search API responses and script execution attempts in UI search

The suite is organized with reusable tags from [tests/attributes/tags.ts](tests/attributes/tags.ts), which makes it possible to run smoke, auth, search, basket, UI, API, and security-focused subsets in local runs and in GitHub Actions.

## Test architecture

The framework is built around separation of concerns:

- test files contain scenarios and assertions
- page objects contain UI actions and UI-specific expectations
- API services contain request logic and response helpers
- fixtures create the test dependencies used in test bodies

This makes tests shorter, easier to read, and easier to maintain.

## Fixtures

Custom fixtures are defined in [tests/fixtures.ts](tests/fixtures.ts).

### Available fixtures

- `pages` access to page objects through `PagesManager`
- `api` access to grouped API service instances
- `expect` re-exported Playwright assertions

### Example

```typescript
import { test, expect } from "../fixtures";

test("should open home page", async ({ pages }) => {
  await pages.homePage.open();
  await pages.homePage.expectLoaded();
});
```

The `pages` fixture is backed by [src/pages/PagesManager.ts](src/pages/PagesManager.ts). Add new page objects there so tests can use them through `pages` without importing each page class in [tests/fixtures.ts](tests/fixtures.ts).

The current `api` fixture exposes:

- `auth`
- `products`
- `basket`

## Writing UI tests

UI tests should rely on page objects instead of placing raw selectors directly in spec files whenever possible.

### Recommended flow

1. Use a fixture from `pages`
2. Call page methods for actions
3. Keep assertions in test files or page methods depending on readability
4. Add tags to the test metadata

### Example UI test

```typescript
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test(
  "should search for a product",
  {
    tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.SEARCH],
  },
  async ({ pages }) => {
    await pages.homePage.open();
    await pages.homePage.expectLoaded();
    await pages.homePage.navbar.search("OWASP Juice Shop Hoodie");
    await pages.homePage.expectProductVisible("OWASP Juice Shop Hoodie");
  },
);
```

## Writing API tests

API tests should use domain services from [src/api/services](src/api/services) instead of constructing raw requests inside spec files.

### Recommended flow

1. Use the `api` fixture
2. Call the service method that matches the business action
3. Parse or validate the response in the test
4. Use test data factories when a user or payload must be generated

### Example API test

```typescript
import { test, expect } from "../fixtures";
import { createTestUser } from "@src/data/factories/userFactory";
import { Tags } from "../attributes/tags";

test(
  "should add item to basket for authorized user",
  {
    tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
  },
  async ({ api }) => {
    const user = createTestUser();
    const login = await api.auth.registerAndLogin(user);

    const response = await api.basket.addItem(login.token, {
      ProductId: 1,
      BasketId: login.basketId,
      quantity: 1,
    });

    expect([200, 201]).toContain(response.status());
  },
);
```

## Page objects and components

Page objects live in [src/pages](src/pages). Shared UI parts live in [src/components](src/components) and [src/modals](src/modals).

### Good practices

- keep selectors inside page object or component classes
- expose business-readable methods such as `open`, `login`, `search`, `addProductToBasket`
- reuse common behavior through a base class such as [src/pages/BasePage.ts](src/pages/BasePage.ts)
- expose new page objects through [src/pages/PagesManager.ts](src/pages/PagesManager.ts) instead of importing them directly in fixtures
- move banner or modal logic out of tests and into reusable objects

## API services

API services live in [src/api/services](src/api/services). They wrap the lower-level HTTP client and expose domain-level operations.

### Good practices

- keep endpoint details in services, not in tests
- expose helper methods such as `registerAndLogin` when they simplify common flows
- throw meaningful errors from service helpers when a response is unexpected
- share low-level request handling through a base API client

## Using `@step`

The framework includes a method decorator in [src/utils/step.ts](src/utils/step.ts) that wraps methods with `test.step`.

This improves readability in Playwright and Allure reports.

### Why use it

- execution logs become easier to read
- report steps describe user actions instead of internal implementation
- page object methods remain self-documenting

### Static step name

```typescript
import { step } from "@src/utils/step";

class LoginPage {
  @step("Open login page")
  async open(): Promise<void> {
    // Implementation...
  }
}
```

### Dynamic step name

```typescript
import { step } from "@src/utils/step";

class Navbar {
  @step((term: string) => `Search for product: ${term}`)
  async search(term: string): Promise<void> {
    // Implementation...
  }
}
```

### When to use `@step`

- use it on meaningful page object methods
- use it on reusable component actions
- use it on modal helper methods when they appear in user flows
- avoid adding it to every tiny private helper

## Tags

### Framework tags storage

The `Tags` class is defined in [tests/attributes/tags.ts](tests/attributes/tags.ts). It stores reusable tags for test categorization.

Each tag is a string that starts with `@`. The current structure includes groups such as:

- `TEST_TYPE`: `@ui`, `@api`, `@security`, `@smoke`, `@regression`
- `FEATURE`: `@auth`, `@search`, `@basket`, `@products`, `@xss`
- `SCENARIO`: `@positive`, `@negative`
- `PRIORITY`: `@critical`

Use the constants from `Tags` instead of hardcoded strings to keep tag names consistent across the suite.

### Usage in test methods

Pass tags through the `tag` property in the test options:

```typescript
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test(
  "should add item to basket for authorized user",
  {
    tag: [Tags.TEST_TYPE.API, Tags.FEATURE.BASKET, Tags.SCENARIO.POSITIVE],
  },
  async ({ api }) => {
    // Test implementation...
  },
);
```

### Running tests with selected tags

The framework supports filtering by the `TAGS_FILTER` environment variable.

Set one or more tags in `.env` as a comma-separated list:

```dotenv
TAGS_FILTER=api,basket
```

You can also use the full tag form:

```dotenv
TAGS_FILTER=@api,@basket
```

Both formats are supported. During startup, the framework normalizes values to the `@tag-name` format automatically.

When `TAGS_FILTER` contains multiple tags, the runner executes tests that match any of them.

### Examples

- `TAGS_FILTER=api` runs all tests tagged with `@api`
- `TAGS_FILTER=basket` runs all tests tagged with `@basket`
- `TAGS_FILTER=api,basket` runs tests tagged with `@api` or `@basket`
- empty `TAGS_FILTER` runs all tests from the selected command

Tag filtering is applied on top of the selected npm script. For example, `npm run test:api` with `TAGS_FILTER=basket` runs only API tests tagged with `@basket`.

## Test data

Test data helpers and factories live in [src/data](src/data).

Use factories when dynamic data is required, especially for entities such as test users. This reduces collisions between runs and keeps setup logic reusable.

## Path aliases

TypeScript path aliases are configured in [tsconfig.json](tsconfig.json).

Available aliases:

- `@src/*`
- `@tests/*`

Example:

```typescript
import { step } from "@src/utils/step";
import { Tags } from "@tests/attributes/tags";
```

## Reporting

The project includes Allure reporting support.

### Run tests with Allure

```bash
npm run test:allure
```

### Generate report

```bash
npm run allure:generate
```

### Open report

```bash
npm run allure:open
```

### Output directories

- `allure-results` raw result files
- `allure-report` generated HTML report with dashboard, suite breakdown, and failure details
- `test-results` Playwright output artifacts

### Example Allure report views

![Allure overview](./files/AllureOverview.jpg)
![Allure test suites](./files/TestSuites.jpg)
![Allure failed test details](./files/FailedTest.jpg)

### Public report links

CI and manual GitHub Actions runs can publish the generated HTML report to GitHub Pages, which makes it possible to open the report in a browser without downloading artifacts locally.

Current public Pages URL:

- [qa-juice-shop GitHub Pages report](https://lenache-1234.github.io/qa-juice-shop/)

Where to find the published report link after a run:

- in the `Deploy Published Report` job summary in GitHub Actions
- in the Slack notification sent after the workflow finishes

Current workflow behavior:

- `CI Tests` publishes the generated Allure report when available
- `Manual QA Tests` publishes the Playwright HTML report
- if the expected report folder is missing, the workflow falls back to the available HTML report or a diagnostic page

## AI Agents

The project includes automation agents for test analysis and coverage tracking.

### Test Result Analyzer

Parses Playwright JSON report to identify flaky tests, failures, and slowest tests. In CI, the analysis is posted as a Slack thread reply to the main test notification.

```bash
npm run analyze
```

Reads `test-report.json` (generated automatically in CI) and outputs a formatted analysis.

### Coverage Tracker

Generates a coverage report based on feature tags, visited routes (from HAR), and API endpoints.

```bash
npm run coverage
npm run coverage:har
```

The report shows:
- feature coverage matrix (which features have tests, which do not)
- route coverage (which pages were visited during tests)
- API endpoint coverage (which endpoints were called)
- uncovered features, routes, and endpoints

Reports are saved to `reports/coverage/`.

### Playwright MCP

The project is configured with [Playwright MCP](.mcp.json) for AI-assisted test generation via Claude Code. With Juice Shop running locally, Claude Code can open a browser, navigate the application, and generate test files that follow the project conventions.

### CI Integration

In GitHub Actions, tests run with `retries: 2` to detect flaky tests. After each run:

1. Test results are analyzed automatically
2. A Slack notification is sent with pass/fail/flaky counts
3. A thread reply is posted with detailed analysis (flaky list, failure reasons, slowest tests)
4. Playwright and Allure reports are published to GitHub Pages

## Recommended workflow for a new teammate

1. Install dependencies with `npm install`
2. Start the application with `npm run docker:up`
3. Configure `.env` with the correct `BASE_URL`
4. Run `npm test` or a smaller suite such as `npm run test:ui`
5. Open a few page objects and service classes to understand the framework style
6. Reuse existing fixtures, tags, page objects, and services before adding new ones

## Framework conventions

- write tests in English
- keep comments and step names in English
- use tags from `Tags` instead of hardcoded tag strings
- prefer page objects and API services over inline selectors or raw requests
- keep tests focused on scenario intent
- move repeated setup logic into fixtures, helpers, or service methods
- use `@step` for meaningful reusable actions

## Where to extend the framework

Add new code in the layer that matches its purpose:

- add a new page flow to `src/pages`
- expose a new page object through `src/pages/PagesManager.ts`
- add a reusable widget to `src/components`
- add a modal or banner helper to `src/modals`
- add a new API area to `src/api/services`
- add reusable data builders to `src/data`
- add new reusable tags to `tests/attributes/tags.ts`
- add tests to the matching suite under `tests`

## Validation

Run TypeScript validation before pushing major framework changes:

```bash
npx tsc --noEmit
```
