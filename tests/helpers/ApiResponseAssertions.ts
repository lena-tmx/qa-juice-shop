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

  @step("Verify API request is rejected as unauthorized")
  async expectUnauthorized(
    response: APIResponse,
    acceptedStatuses: readonly number[] = [401],
  ): Promise<void> {
    expect(
      acceptedStatuses,
      `Expected ${acceptedStatuses.join(" or ")}, but got ${response.status()} ${response.statusText()}`,
    ).toContain(response.status());
  }
}
