import type { APIResponse } from "@playwright/test";
import { ApiClient } from "../clients/ApiClient";

export class OrderApi extends ApiClient {
  getHistory(token: string): Promise<APIResponse> {
    return this.get("/rest/order-history", {
      headers: this.authorizationHeaders(token),
    });
  }
}
