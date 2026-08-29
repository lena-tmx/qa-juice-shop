import type { APIResponse } from "@playwright/test";
import Ajv, {
  type ErrorObject,
  type JSONSchemaType,
  type ValidateFunction,
} from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

const validators = new WeakMap<object, ValidateFunction>();

function formatErrors(errors: ErrorObject[] | null | undefined): string {
  return (errors ?? [])
    .map(({ instancePath, message }) => `${instancePath || "/"} ${message}`)
    .join("; ");
}

export async function parseApiResponse<T>(
  response: APIResponse,
  schema: JSONSchemaType<T>,
): Promise<T> {
  const body: unknown = await response.json();
  let validate = validators.get(schema as object) as
    ValidateFunction<T> | undefined;

  if (!validate) {
    validate = ajv.compile<T>(schema);
    validators.set(schema as object, validate);
  }

  if (!validate(body)) {
    throw new Error(
      `API response schema validation failed (${response.status()} ${response.url()}): ${formatErrors(validate.errors)}`,
    );
  }

  return body;
}
