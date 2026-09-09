import { APIRequestContext, APIResponse } from "@playwright/test";
import { step } from "@src/utils/step";
import {
  type ApiRequestReporter,
  PlaywrightApiRequestReporter,
} from "../reporting/ApiRequestReporter";

export class ApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    private readonly reporter: ApiRequestReporter = new PlaywrightApiRequestReporter(),
  ) {}

  @step((url: string) => `HTTP GET ${url}`)
  protected async get(
    url: string,
    options?: Parameters<APIRequestContext["get"]>[1],
  ): Promise<APIResponse> {
    const response = await this.request.get(url, options);
    await this.reporter.attachExchange("GET", url, options, response);
    return response;
  }

  @step((url: string) => `HTTP POST ${url}`)
  protected async post(
    url: string,
    options?: Parameters<APIRequestContext["post"]>[1],
  ): Promise<APIResponse> {
    const response = await this.request.post(url, options);
    await this.reporter.attachExchange("POST", url, options, response);
    return response;
  }

  @step((url: string) => `HTTP PUT ${url}`)
  protected async put(
    url: string,
    options?: Parameters<APIRequestContext["put"]>[1],
  ): Promise<APIResponse> {
    const response = await this.request.put(url, options);
    await this.reporter.attachExchange("PUT", url, options, response);
    return response;
  }

  @step((url: string) => `HTTP DELETE ${url}`)
  protected async delete(
    url: string,
    options?: Parameters<APIRequestContext["delete"]>[1],
  ): Promise<APIResponse> {
    const response = await this.request.delete(url, options);
    await this.reporter.attachExchange("DELETE", url, options, response);
    return response;
  }

  protected authorizationHeaders(
    token: string | undefined,
    additionalHeaders: Record<string, string> = {},
  ): Record<string, string> | undefined {
    const headers = token
      ? { ...additionalHeaders, Authorization: `Bearer ${token}` }
      : additionalHeaders;

    return Object.keys(headers).length > 0 ? headers : undefined;
  }
}
