# Test Coverage Matrix

> Feature-level view of test coverage across API, UI, and Security layers.
>
> **Legend:** :white_check_mark: covered | :construction: partial | :x: not covered

| Feature | Risk | API covered | UI covered | Security covered | Priority |
|---------|------|:-----------:|:----------:|:----------------:|----------|
| **Auth — Login** | High | :white_check_mark: `auth.api.spec.ts` | :white_check_mark: `login.spec.ts` | :x: `auth.security.spec.ts` (empty) | Critical |
| **Auth — Registration** | High | :white_check_mark: `auth.api.spec.ts` | :x: | :x: | Critical |
| **Auth — Logout** | Medium | :x: | :white_check_mark: `login.spec.ts` | :x: | High |
| **Products — Listing** | Medium | :white_check_mark: `products.api.spec.ts` | :x: | :x: | High |
| **Products — Search** | Medium | :white_check_mark: `products.api.spec.ts` | :white_check_mark: `search.spec.ts` | :x: | High |
| **Basket** | High | :white_check_mark: `basket.api.spec.ts` | :white_check_mark: `basket.spec.ts` | :white_check_mark: `basket.security.spec.ts` | Critical |
| **Checkout** | High | :x: | :x: | :x: | Critical |
| **Address** | Medium | :x: | :x: | :x: | Medium |
| **Delivery** | Medium | :x: | :x: | :x: | Medium |
| **Payment** | High | :x: | :x: | :x: | Critical |
| **Orders** | Medium | :x: | :x: | :x: | High |
| **User Profile** | Medium | :x: | :x: | :x: | Medium |
| **Security — XSS** | High | — | — | :white_check_mark: `xss.security.spec.ts` | Critical |
| **Security — IDOR** | High | — | — | :white_check_mark: `basket.security.spec.ts` | Critical |
| **Security — SQL Injection** | High | — | — | :x: | Critical |
| **Security — Auth Bypass** | High | — | — | :x: | Critical |
| **Security — Headers** | Medium | — | — | :x: | High |
| **Admin / Hidden** | Low | :x: | :x: | :x: | Low |
| **Error Handling** | Medium | :x: | :x: | :x: | Medium |

## Coverage Gaps Summary

### Critical — no coverage at all

- **Checkout** — full flow (address, delivery, payment, order confirmation)
- **Payment** — card management, payment processing
- **SQL Injection** — `'OR 1=1--` and similar payloads on login, search, API params
- **Auth Bypass** — token manipulation, password reset, privilege escalation
- **Auth Security** — `auth.security.spec.ts` exists but is empty

### High — partially covered or single layer only

- **Registration** — API only, no UI tests for the registration form
- **Logout** — UI only, no API/session invalidation tests
- **Products Listing** — API only, no UI tests for product cards/detail page
- **Orders** — no coverage
- **Security Headers** — CSP, X-Frame-Options, HSTS not verified

### Recommended next steps

1. Fill `auth.security.spec.ts` (brute-force, token expiry, session fixation)
2. Add SQL injection tests for login and search
3. Add checkout flow — UI end-to-end + API-level
4. Add registration UI tests (validation, duplicate email, weak password)
5. Add security headers verification test
