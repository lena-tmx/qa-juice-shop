import { step } from "@src/utils/step";
import type { OrderApi } from "../endpoints/OrderApi";
import { orderHistoryResponseSchema } from "../schemas/order.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";
import { BaseService } from "./BaseService";

export class OrderService extends BaseService {
  constructor(private readonly api: OrderApi) {
    super();
  }

  @step("Retrieve order history")
  async getHistory(token: string): Promise<Record<string, unknown>[]> {
    return this.execute("Retrieve order history", async () => {
      const response = await this.api.getHistory(token);
      const body = await parseApiResponse(
        response,
        orderHistoryResponseSchema,
        [200],
      );
      return body.data;
    });
  }
}
