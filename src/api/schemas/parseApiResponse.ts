import type { APIResponse } from "@playwright/test";
import type { z } from "zod";

export async function parseApiResponse<TSchema extends z.ZodType>(
  response: APIResponse,
  schema: TSchema,
): Promise<z.infer<TSchema>> {
  const body: unknown = await response.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new Error(
      `API response schema validation failed (${response.status()} ${response.url()}): ${JSON.stringify(result.error.issues)}`,
    );
  }

  return result.data;
}
