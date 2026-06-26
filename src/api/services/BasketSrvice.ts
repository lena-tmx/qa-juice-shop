import { APIRequestContext } from "@playwright/test";
import { ApiClient } from "../clients/ApiClient";
import {
  BasketItemResponse,
  AddBasketItemRequest,
} from "../types/basket.types";

export class BasketService extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

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

  async getBasket(basketId: string | number, token?: string) {
    return this.get(`/rest/basket/${basketId}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
  }

  async getBasketItemsResponse(token: string) {
    return this.get("/api/BasketItems/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getBasketItems(token: string): Promise<BasketItemResponse[]> {
    const response = await this.getBasketItemsResponse(token);
    const body = await response.json();
    return body.data;
  }

  async updateItem(token: string, itemId: number, quantity: number) {
    return this.put(`/api/BasketItems/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { quantity },
    });
  }

  async deleteItem(token: string, itemId: number) {
    return this.delete(`/api/BasketItems/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
