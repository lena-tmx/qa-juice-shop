import { APIRequestContext } from "@playwright/test";
import { ApiClient } from "../clients/ApiClient";
import {
  BasketItemResponse,
  AddBasketItemRequest,
} from "../types/basket.types";
import { step } from "@src/utils/step";
import { basketItemsResponseSchema } from "../schemas/api.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";

export class BasketService extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  @step((token: string | undefined, payload: AddBasketItemRequest) => `Add product to basket (product id: ${payload.ProductId})`)
  async addItem(token: string | undefined, payload: AddBasketItemRequest) {
    return this.post("/api/BasketItems/", {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      data: payload,
    });
  }

  @step((basketId: string | number) => `Retrieve basket contents (id: ${basketId})`)
  async getBasket(basketId: string | number, token?: string) {
    return this.get(`/rest/basket/${basketId}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
  }

  @step("Fetch basket items (raw API response)")
  async getBasketItemsResponse(token: string) {
    return this.get("/api/BasketItems/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  @step("Retrieve basket items")
  async getBasketItems(token: string): Promise<BasketItemResponse[]> {
    const response = await this.getBasketItemsResponse(token);
    const body = await parseApiResponse(response, basketItemsResponseSchema);
    return body.data;
  }

  @step((token: string, itemId: number, quantity: number) => `Update basket item quantity (id: ${itemId}) to ${quantity}`)
  async updateItem(token: string, itemId: number, quantity: number) {
    return this.put(`/api/BasketItems/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { quantity },
    });
  }

  @step((token: string, itemId: number) => `Remove item from basket (id: ${itemId})`)
  async deleteItem(token: string, itemId: number) {
    return this.delete(`/api/BasketItems/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
