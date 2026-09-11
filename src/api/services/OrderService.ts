import { ApiClient } from "../clients/ApiClient";
import { step } from "@src/utils/step";
import { orderHistoryResponseSchema } from "../schemas/order.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";

export class OrderService extends ApiClient {
  @step("Get order history")
  async getHistoryResponse(token: string) {
    return this.get("/rest/order-history", {
      headers: this.authorizationHeaders(token),
    });
  }

  @step("Retrieve order history")
  async getHistory(token: string): Promise<Record<string, unknown>[]> {
    const response = await this.getHistoryResponse(token);
    const body = await parseApiResponse(
      response,
      orderHistoryResponseSchema,
      [200],
    );
    return body.data;
  }
}
