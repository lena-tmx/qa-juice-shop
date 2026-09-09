import { qase } from "playwright-qase-reporter";
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe("Input Validation", () => {
  test(
    qase(
      39,
      "should not reflect raw script payload in products search API response",
    ),
    {
      tag: [
        Tags.TEST_TYPE.SECURITY,
        Tags.TEST_TYPE.API,
        Tags.FEATURE.XSS,
        Tags.FEATURE.INPUT_VALIDATION,
        Tags.PRIORITY.CRITICAL,
      ],
    },
    async ({ searchSecurity }) => {
      const payload = `<script>alert(1)</script>`;

      await searchSecurity.expectApiPayloadNotReflected(payload);
    },
  );

  test(
    qase(95, "should not execute script payload in UI search"),
    {
      tag: [
        Tags.TEST_TYPE.SECURITY,
        Tags.TEST_TYPE.UI,
        Tags.FEATURE.XSS,
        Tags.FEATURE.INPUT_VALIDATION,
        Tags.PRIORITY.CRITICAL,
      ],
    },
    async ({ searchSecurity }) => {
      const payload = `<img src=x onerror=alert('xss')>`;

      await searchSecurity.expectUiPayloadNotExecuted(payload);
    },
  );
});
