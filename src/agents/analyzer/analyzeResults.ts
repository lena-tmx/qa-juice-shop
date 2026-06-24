import * as fs from "fs";

interface JSONReportTestResult {
  status: string;
  duration: number;
  retry: number;
  errors: Array<{ message?: string }>;
}

interface JSONReportTest {
  projectName: string;
  results: JSONReportTestResult[];
  status: "expected" | "unexpected" | "flaky" | "skipped";
}

interface JSONReportSpec {
  title: string;
  tests: JSONReportTest[];
}

interface JSONReportSuite {
  title: string;
  file: string;
  specs: JSONReportSpec[];
  suites: JSONReportSuite[];
}

interface JSONReport {
  suites: JSONReportSuite[];
}

interface AnalyzedTest {
  title: string;
  file: string;
  status: string;
  duration: number;
  retries: number;
  error?: string;
  project: string;
}

function collectTests(
  suites: JSONReportSuite[],
  parentFile?: string,
): AnalyzedTest[] {
  const tests: AnalyzedTest[] = [];

  for (const suite of suites) {
    const file = suite.file || parentFile || "";

    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const totalDuration = test.results.reduce(
          (sum, r) => sum + r.duration,
          0,
        );
        const error = test.results
          .flatMap((r) => r.errors || [])
          .find((e) => e?.message)?.message;

        tests.push({
          title: spec.title,
          file: file.replace(/^.*?(tests\/)/, "$1"),
          status: test.status,
          duration: totalDuration,
          retries: test.results.length - 1,
          error: error ? error.split("\n")[0].substring(0, 200) : undefined,
          project: test.projectName,
        });
      }
    }

    if (suite.suites) {
      tests.push(...collectTests(suite.suites, file));
    }
  }

  return tests;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}m ${remaining}s`;
}

function formatSlackMessage(tests: AnalyzedTest[]): string {
  if (tests.length === 0) {
    return ":mag: *Test Analysis*\n\nNo test results found.";
  }

  const passed = tests.filter((t) => t.status === "expected");
  const failed = tests.filter((t) => t.status === "unexpected");
  const flaky = tests.filter((t) => t.status === "flaky");
  const skipped = tests.filter((t) => t.status === "skipped");

  const total = tests.length;
  const passRate =
    total > 0
      ? (((passed.length + flaky.length) / total) * 100).toFixed(1)
      : "0";
  const totalDuration = tests.reduce((sum, t) => sum + t.duration, 0);

  const lines: string[] = [];

  lines.push(":mag: *Test Analysis*");
  lines.push("");
  lines.push(
    `:bar_chart: *Summary:* ${passRate}% pass rate | ${total} tests | ${formatDuration(totalDuration)}`,
  );

  if (flaky.length > 0) {
    lines.push("");
    lines.push(`:zap: *Flaky Tests (${flaky.length}):*`);
    for (const t of flaky) {
      lines.push(
        `  • \`${t.title}\` — ${t.file} (passed on retry ${t.retries})`,
      );
    }
  }

  if (failed.length > 0) {
    lines.push("");
    lines.push(`:x: *Failed Tests (${failed.length}):*`);
    for (const t of failed) {
      lines.push(`  • \`${t.title}\` — ${t.file}`);
      if (t.error) {
        lines.push(`    _${t.error}_`);
      }
    }
  }

  const slowest = [...tests]
    .filter((t) => t.status !== "skipped")
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5);

  if (slowest.length > 0) {
    lines.push("");
    lines.push(":turtle: *Slowest Tests:*");
    for (const t of slowest) {
      lines.push(
        `  • ${formatDuration(t.duration)} — \`${t.title}\` (${t.file})`,
      );
    }
  }

  return lines.join("\n");
}

const inputPath = process.argv[2] || "test-report.json";
const outputPath = process.argv[3] || "analysis-message.txt";

if (!fs.existsSync(inputPath)) {
  const fallback =
    ":mag: *Test Analysis*\n\nNo test results JSON found. Ensure the `json` reporter is configured.";
  fs.writeFileSync(outputPath, fallback);
  console.log(fallback);
  process.exit(0);
}

const report: JSONReport = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
const tests = collectTests(report.suites);
const message = formatSlackMessage(tests);

fs.writeFileSync(outputPath, message);
console.log(message);
