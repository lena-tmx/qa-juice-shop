import { APIRequestContext } from "@playwright/test";
import { ApiClient } from "../clients/ApiClient";
import { step } from "@src/utils/step";

export class OrderService extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  @step()
  async getHistory(token: string) {
    return this.get("/rest/order-history", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
