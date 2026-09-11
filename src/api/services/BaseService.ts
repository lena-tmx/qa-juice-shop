import type { APIResponse } from "@playwright/test";

export abstract class BaseService {
  protected async execute<T>(
    operation: string,
    action: () => Promise<T>,
  ): Promise<T> {
    try {
      return await action();
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`${operation} failed: ${reason}`, { cause: error });
    }
  }

  protected requireStatus(
    operation: string,
    response: APIResponse,
    expectedStatus: number,
  ): void {
    if (response.status() !== expectedStatus) {
      throw new Error(
        `${operation} expected HTTP ${expectedStatus}, but received HTTP ${response.status()} ${response.statusText()}`,
      );
    }
  }
}
