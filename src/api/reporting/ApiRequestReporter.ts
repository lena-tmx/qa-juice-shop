import { test, type APIResponse } from "@playwright/test";
import { env } from "@src/utils/env";

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  data?: unknown;
}

export interface ApiRequestReporter {
  attachExchange(
    method: string,
    url: string,
    options: ApiRequestOptions | undefined,
    response: APIResponse,
  ): Promise<void>;
}

export class PlaywrightApiRequestReporter implements ApiRequestReporter {
  async attachExchange(
    method: string,
    url: string,
    options: ApiRequestOptions | undefined,
    response: APIResponse,
  ): Promise<void> {
    const label = `${method} ${this.formatEndpoint(url)}`;
    const testInfo = test.info();

    await testInfo.attach(`API request - ${label}`, {
      body: this.buildCurl(method, url, options),
      contentType: "text/plain",
    });

    await testInfo.attach(
      `API response - ${label} - status ${response.status()}`,
      {
        body: `Status: ${response.status()}\n\n${await this.responseBody(response)}`,
        contentType: "text/plain",
      },
    );
  }

  private buildCurl(
    method: string,
    url: string,
    options: ApiRequestOptions | undefined,
  ): string {
    const headers = this.sanitizeHeaders(options?.headers);
    if (options?.data !== undefined && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const fullUrl = url.startsWith("http") ? url : `${env.baseUrl}${url}`;
    const curlParts = [`curl -X ${method} ${this.shellQuote(fullUrl)}`];

    for (const [key, value] of Object.entries(headers)) {
      curlParts.push(`-H ${this.shellQuote(`${key}: ${value}`)}`);
    }
    if (options?.data !== undefined) {
      curlParts.push(`-d ${this.shellQuote(JSON.stringify(options.data))}`);
    }

    return curlParts.join(" \\\n  ");
  }

  private sanitizeHeaders(
    headers: Record<string, string> | undefined,
  ): Record<string, string> {
    const sanitizedHeaders = { ...(headers ?? {}) };
    const authorizationHeader = Object.keys(sanitizedHeaders).find(
      (header) => header.toLowerCase() === "authorization",
    );

    if (authorizationHeader) {
      sanitizedHeaders[authorizationHeader] = "Bearer ***";
    }

    return sanitizedHeaders;
  }

  private async responseBody(response: APIResponse): Promise<string> {
    try {
      return JSON.stringify(await response.json(), null, 2);
    } catch {
      return response.text();
    }
  }

  private formatEndpoint(url: string): string {
    return url
      .replace(/^https?:\/\//, "")
      .replace(/[/?&=]+/g, " ")
      .trim();
  }

  private shellQuote(value: string): string {
    return `'${value.replace(/'/g, `'\\''`)}'`;
  }
}
