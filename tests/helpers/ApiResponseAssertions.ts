import { expect, type APIResponse } from "@playwright/test";
import { step } from "@src/utils/step";

export class ApiResponseAssertions {
  @step(
    (response: APIResponse, expectedStatus: number) =>
      `Verify API response status is ${expectedStatus}`,
  )
  async expectStatus(
    response: APIResponse,
    expectedStatus: number,
  ): Promise<void> {
    expect(
      response.status(),
      `Expected ${expectedStatus}, but got ${response.status()} ${response.statusText()}`,
    ).toBe(expectedStatus);
  }
}
