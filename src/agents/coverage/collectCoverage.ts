import * as fs from "fs";
import * as path from "path";

interface FeatureCoverage {
  feature: string;
  tests: Array<{
    title: string;
    file: string;
    types: string[];
    scenarios: string[];
  }>;
}

interface RouteCoverage {
  url: string;
  count: number;
  tests: string[];
}

interface ApiCoverage {
  method: string;
  endpoint: string;
  count: number;
  tests: string[];
}

interface CoverageReport {
  timestamp: string;
  featureMatrix: FeatureCoverage[];
  routeCoverage: RouteCoverage[];
  apiCoverage: ApiCoverage[];
  uncoveredFeatures: string[];
  summary: {
    totalTests: number;
    totalFeatures: number;
    coveredFeatures: number;
    totalRoutes: number;
    totalApiEndpoints: number;
  };
}

const KNOWN_FEATURES = [
  "auth",
  "search",
  "basket",
  "products",
  "registration",
  "profile",
  "administration",
  "checkout",
  "feedback",
  "contact",
  "score-board",
  "wallet",
  "address",
  "payment",
  "order-history",
  "recycling",
  "deluxe",
];

const KNOWN_API_ENDPOINTS = [
  { method: "POST", endpoint: "/api/Users" },
  { method: "POST", endpoint: "/rest/user/login" },
  { method: "GET", endpoint: "/rest/user/whoami" },
  { method: "GET", endpoint: "/rest/products/search" },
  { method: "GET", endpoint: "/api/Products" },
  { method: "GET", endpoint: "/api/Products/:id" },
  { method: "POST", endpoint: "/api/BasketItems" },
  { method: "GET", endpoint: "/rest/basket/:id" },
  { method: "PUT", endpoint: "/api/BasketItems/:id" },
  { method: "DELETE", endpoint: "/api/BasketItems/:id" },
  { method: "GET", endpoint: "/api/SecurityQuestions" },
  { method: "POST", endpoint: "/api/SecurityAnswers" },
  { method: "GET", endpoint: "/api/Feedbacks" },
  { method: "POST", endpoint: "/api/Feedbacks" },
  { method: "GET", endpoint: "/rest/user/change-password" },
  { method: "POST", endpoint: "/rest/user/reset-password" },
  { method: "GET", endpoint: "/api/Addresses" },
  { method: "POST", endpoint: "/api/Addresses" },
  { method: "GET", endpoint: "/rest/memories" },
  { method: "POST", endpoint: "/api/Recycles" },
  { method: "GET", endpoint: "/api/Cards" },
  { method: "POST", endpoint: "/api/Cards" },
  { method: "GET", endpoint: "/rest/order-history" },
  { method: "POST", endpoint: "/rest/basket/:id/checkout" },
  { method: "GET", endpoint: "/api/Challenges" },
  { method: "GET", endpoint: "/rest/admin/application-configuration" },
];

const KNOWN_ROUTES = [
  "/",
  "/#/login",
  "/#/register",
  "/#/search",
  "/#/basket",
  "/#/address/select",
  "/#/delivery-method",
  "/#/payment/shop",
  "/#/order-summary",
  "/#/order-completion",
  "/#/contact",
  "/#/about",
  "/#/score-board",
  "/#/complain",
  "/#/chatbot",
  "/#/recycle",
  "/#/wallet",
  "/#/deluxe-membership",
  "/#/privacy-security/change-password",
  "/#/privacy-security/privacy-policy",
  "/#/administration",
  "/#/accounting",
  "/#/photo-wall",
];

function extractTagValue(tag: string): string {
  return tag.replace(/^@/, "").toLowerCase();
}

function parseTestFiles(testsDir: string): Array<{
  title: string;
  file: string;
  tags: string[];
}> {
  const tests: Array<{ title: string; file: string; tags: string[] }> = [];
  const files = findSpecFiles(testsDir);

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const relativePath = path.relative(process.cwd(), file);

    const testBlocks =
      content.match(
        /test\(\s*\n?\s*["'`](.*?)["'`],?\s*\n?\s*\{[^}]*tag:\s*\[(.*?)\]/gs,
      ) || [];

    for (const block of testBlocks) {
      const titleMatch = block.match(/test\(\s*\n?\s*["'`](.*?)["'`]/);
      const tagsMatch = block.match(/tag:\s*\[(.*?)\]/s);

      if (titleMatch && tagsMatch) {
        const title = titleMatch[1];
        const tagsStr = tagsMatch[1];
        const tags =
          tagsStr.match(/Tags\.\w+\.\w+/g)?.map((t) => {
            const parts = t.split(".");
            const group = parts[1];
            const value = parts[2];
            return resolveTag(group, value);
          }) || [];

        tests.push({ title, file: relativePath, tags });
      }
    }
  }

  return tests;
}

function resolveTag(group: string, value: string): string {
  const tagMap: Record<string, Record<string, string>> = {
    TEST_TYPE: {
      UI: "@ui",
      API: "@api",
      SECURITY: "@security",
      SMOKE: "@smoke",
      REGRESSION: "@regression",
    },
    FEATURE: {
      AUTH: "@auth",
      REGISTRATION: "@registration",
      SEARCH: "@search",
      BASKET: "@basket",
      PRODUCTS: "@products",
      CHECKOUT: "@checkout",
      ADDRESS: "@address",
      PAYMENT: "@payment",
      ORDER_HISTORY: "@order-history",
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
    },
    SCENARIO: { POSITIVE: "@positive", NEGATIVE: "@negative" },
    PRIORITY: { CRITICAL: "@critical" },
  };

  return tagMap[group]?.[value] || `@${value.toLowerCase()}`;
}

function findSpecFiles(dir: string): string[] {
  const results: string[] = [];

  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findSpecFiles(fullPath));
    } else if (entry.name.endsWith(".spec.ts")) {
      results.push(fullPath);
    }
  }

  return results;
}

function parseHarFile(harPath: string): {
  routes: RouteCoverage[];
  api: ApiCoverage[];
} {
  const routes: Map<string, RouteCoverage> = new Map();
  const api: Map<string, ApiCoverage> = new Map();

  if (!fs.existsSync(harPath)) {
    return { routes: [], api: [] };
  }

  const har = JSON.parse(fs.readFileSync(harPath, "utf-8"));
  const entries = har.log?.entries || [];

  for (const entry of entries) {
    const url = new URL(entry.request.url);
    const method = entry.request.method;
    const pathname = url.pathname + url.hash;

    if (
      pathname.startsWith("/api/") ||
      pathname.startsWith("/rest/") ||
      pathname.startsWith("/b2b/")
    ) {
      const normalized = normalizeApiPath(pathname);
      const key = `${method} ${normalized}`;
      const existing = api.get(key);
      if (existing) {
        existing.count++;
      } else {
        api.set(key, { method, endpoint: normalized, count: 1, tests: [] });
      }
    }

    if (method === "GET" && !pathname.startsWith("/api/")) {
      const existing = routes.get(pathname);
      if (existing) {
        existing.count++;
      } else {
        routes.set(pathname, { url: pathname, count: 1, tests: [] });
      }
    }
  }

  return {
    routes: [...routes.values()],
    api: [...api.values()],
  };
}

function normalizeApiPath(pathname: string): string {
  return pathname.replace(/\/\d+/g, "/:id");
}

function buildFeatureMatrix(
  tests: Array<{ title: string; file: string; tags: string[] }>,
): FeatureCoverage[] {
  const featureMap = new Map<string, FeatureCoverage>();

  for (const test of tests) {
    const featureTags = test.tags.filter(
      (t) =>
        !["@ui", "@api", "@security", "@smoke", "@regression"].includes(t) &&
        !["@positive", "@negative"].includes(t) &&
        !["@critical"].includes(t),
    );

    const typeTags = test.tags.filter((t) =>
      ["@ui", "@api", "@security"].includes(t),
    );
    const scenarioTags = test.tags.filter((t) =>
      ["@positive", "@negative"].includes(t),
    );

    for (const tag of featureTags) {
      const feature = extractTagValue(tag);
      if (!featureMap.has(feature)) {
        featureMap.set(feature, { feature, tests: [] });
      }
      featureMap.get(feature)!.tests.push({
        title: test.title,
        file: test.file,
        types: typeTags.map(extractTagValue),
        scenarios: scenarioTags.map(extractTagValue),
      });
    }
  }

  return [...featureMap.values()].sort((a, b) =>
    a.feature.localeCompare(b.feature),
  );
}

function formatReport(report: CoverageReport): string {
  const lines: string[] = [];

  lines.push("# Coverage Report");
  lines.push(`Generated: ${report.timestamp}`);
  lines.push("");

  lines.push("## Summary");
  lines.push("");
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total tests | ${report.summary.totalTests} |`);
  lines.push(
    `| Features covered | ${report.summary.coveredFeatures}/${report.summary.totalFeatures} |`,
  );
  lines.push(`| Routes visited | ${report.summary.totalRoutes} |`);
  lines.push(`| API endpoints hit | ${report.summary.totalApiEndpoints} |`);
  lines.push("");

  lines.push("## Feature Coverage Matrix");
  lines.push("");
  for (const feature of report.featureMatrix) {
    lines.push(`### ${feature.feature} (${feature.tests.length} tests)`);
    lines.push("");
    lines.push("| Test | File | Type | Scenario |");
    lines.push("|------|------|------|----------|");
    for (const test of feature.tests) {
      lines.push(
        `| ${test.title} | ${test.file} | ${test.types.join(", ")} | ${test.scenarios.join(", ") || "-"} |`,
      );
    }
    lines.push("");
  }

  if (report.uncoveredFeatures.length > 0) {
    lines.push("## Uncovered Features");
    lines.push("");
    for (const f of report.uncoveredFeatures) {
      lines.push(`- ${f}`);
    }
    lines.push("");
  }

  if (report.routeCoverage.length > 0) {
    lines.push("## Route Coverage");
    lines.push("");
    lines.push("| Route | Hits |");
    lines.push("|-------|------|");
    for (const r of report.routeCoverage.sort((a, b) => b.count - a.count)) {
      lines.push(`| ${r.url} | ${r.count} |`);
    }

    const uncoveredRoutes = KNOWN_ROUTES.filter(
      (kr) => !report.routeCoverage.some((rc) => rc.url.includes(kr)),
    );
    if (uncoveredRoutes.length > 0) {
      lines.push("");
      lines.push("### Uncovered Routes");
      lines.push("");
      for (const r of uncoveredRoutes) {
        lines.push(`- ${r}`);
      }
    }
    lines.push("");
  }

  if (report.apiCoverage.length > 0) {
    lines.push("## API Endpoint Coverage");
    lines.push("");
    lines.push("| Method | Endpoint | Hits |");
    lines.push("|--------|----------|------|");
    for (const a of report.apiCoverage.sort((a, b) => b.count - a.count)) {
      lines.push(`| ${a.method} | ${a.endpoint} | ${a.count} |`);
    }

    const uncoveredApi = KNOWN_API_ENDPOINTS.filter(
      (ka) =>
        !report.apiCoverage.some(
          (ac) => ac.method === ka.method && ac.endpoint === ka.endpoint,
        ),
    );
    if (uncoveredApi.length > 0) {
      lines.push("");
      lines.push("### Uncovered API Endpoints");
      lines.push("");
      for (const a of uncoveredApi) {
        lines.push(`- ${a.method} ${a.endpoint}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

// Main
const testsDir = path.resolve(process.cwd(), "tests");
const harPath = process.argv[2] || "";
const outputPath = process.argv[3] || "reports/coverage/coverage-report.md";

const tests = parseTestFiles(testsDir);
const featureMatrix = buildFeatureMatrix(tests);
const coveredFeatures = new Set(featureMatrix.map((f) => f.feature));
const uncoveredFeatures = KNOWN_FEATURES.filter(
  (f) => !coveredFeatures.has(f),
);

let routeCoverage: RouteCoverage[] = [];
let apiCoverage: ApiCoverage[] = [];

if (harPath && fs.existsSync(harPath)) {
  const harData = parseHarFile(harPath);
  routeCoverage = harData.routes;
  apiCoverage = harData.api;
}

const report: CoverageReport = {
  timestamp: new Date().toISOString(),
  featureMatrix,
  routeCoverage,
  apiCoverage,
  uncoveredFeatures,
  summary: {
    totalTests: tests.length,
    totalFeatures: KNOWN_FEATURES.length,
    coveredFeatures: coveredFeatures.size,
    totalRoutes: routeCoverage.length,
    totalApiEndpoints: apiCoverage.length,
  },
};

const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const markdown = formatReport(report);
fs.writeFileSync(outputPath, markdown);
console.log(markdown);
