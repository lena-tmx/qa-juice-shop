import { APIRequestContext, APIResponse, test } from "@playwright/test";
import { env } from "@src/utils/env";

type RequestOptions = {
  headers?: Record<string, string>;
  data?: unknown;
};

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

export class ApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  private async attachRequestAndResponse(
    method: string,
    url: string,
    options: RequestOptions | undefined,
    response: APIResponse,
  ): Promise<void> {
    const headers = { ...(options?.headers ?? {}) };
    if (headers.Authorization) {
      headers.Authorization = "Bearer ***";
    }

    if (options?.data !== undefined && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const fullUrl = url.startsWith("http") ? url : `${env.baseUrl}${url}`;
    const curlParts = [`curl -X ${method} ${shellQuote(fullUrl)}`];
    for (const [key, value] of Object.entries(headers)) {
      curlParts.push(`-H ${shellQuote(`${key}: ${value}`)}`);
    }
    if (options?.data !== undefined) {
      curlParts.push(`-d ${shellQuote(JSON.stringify(options.data))}`);
    }

    // Use Playwright's native attachment API (not allure-js-commons) so every
    // configured reporter — Allure, Qase, HTML — picks these up and nests
    // them under the currently active step. The endpoint is baked into the
    // attachment name itself so it stays identifiable even in a report view
    // that lists attachments flat instead of nested under their step.
    const label = `${method} ${url}`;
    const testInfo = test.info();

    await testInfo.attach(`Request: ${label}`, {
      body: curlParts.join(" \\\n  "),
      contentType: "text/plain",
    });

    const status = response.status();
    let body: string;
    try {
      body = JSON.stringify(await response.json(), null, 2);
    } catch {
      body = await response.text();
    }
    await testInfo.attach(`Response: ${label} -> ${status}`, {
      body: `Status: ${status}\n\n${body}`,
      contentType: "text/plain",
    });
  }

  protected async get(
    url: string,
    options?: Parameters<APIRequestContext["get"]>[1],
  ): Promise<APIResponse> {
    const response = await this.request.get(url, options);
    await this.attachRequestAndResponse("GET", url, options, response);
    return response;
  }

  protected async post(
    url: string,
    options?: Parameters<APIRequestContext["post"]>[1],
  ): Promise<APIResponse> {
    const response = await this.request.post(url, options);
    await this.attachRequestAndResponse("POST", url, options, response);
    return response;
  }

  protected async put(
    url: string,
    options?: Parameters<APIRequestContext["put"]>[1],
  ): Promise<APIResponse> {
    const response = await this.request.put(url, options);
    await this.attachRequestAndResponse("PUT", url, options, response);
    return response;
  }

  protected async delete(
    url: string,
    options?: Parameters<APIRequestContext["delete"]>[1],
  ): Promise<APIResponse> {
    const response = await this.request.delete(url, options);
    await this.attachRequestAndResponse("DELETE", url, options, response);
    return response;
  }
}
