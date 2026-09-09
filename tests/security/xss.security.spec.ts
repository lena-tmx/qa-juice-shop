import { qase } from "playwright-qase-reporter";
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe("Input Validation", () => {
  test(
    qase(39, "Product search API does not reflect a script payload"),
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
    qase(95, "Product search interface does not execute a script payload"),
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
