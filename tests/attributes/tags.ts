export class Tags {
  static readonly TEST_TYPE = {
    UI: "@ui",
    API: "@api",
    SECURITY: "@security",
    SMOKE: "@smoke",
    REGRESSION: "@regression",
  };

  static readonly FEATURE = {
    AUTH: "@auth",
    REGISTRATION: "@registration",
    SEARCH: "@search",
    BASKET: "@basket",
    PRODUCTS: "@products",
    CHECKOUT: "@checkout",
    ADDRESS: "@address",
    PAYMENT: "@payment",
    ORDERS: "@orders",
    PROFILE: "@profile",
    ADMIN: "@admin",
    FEEDBACK: "@feedback",
    XSS: "@xss",
    IDOR: "@idor",
    SQL_INJECTION: "@sql-injection",
    SESSION: "@session",
    HEADERS: "@headers",
    ACCESS_CONTROL: "@access-control",
    INPUT_VALIDATION: "@input-validation",
  };

  static readonly SCENARIO = {
    POSITIVE: "@positive",
    NEGATIVE: "@negative",
  };

  static readonly PRIORITY = {
    CRITICAL: "@critical",
  };

  static getAllTags(): string[] {
    const allTags = {
      ...Tags.FEATURE,
      ...Tags.TEST_TYPE,
      ...Tags.PRIORITY,
      ...Tags.SCENARIO,
    };

    return Object.values(allTags).map((tag) => tag.replace("@", ""));
  }
}
