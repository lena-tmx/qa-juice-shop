import { ApiClient } from "../clients/ApiClient";
import { step } from "@src/utils/step";

export class OrderService extends ApiClient {
  @step("Retrieve order history")
  async getHistory(token: string) {
    return this.get("/rest/order-history", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
