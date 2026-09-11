import type { APIResponse } from "@playwright/test";
import type { AddBasketItemRequest } from "../types/basket.types";
import { ApiClient } from "../clients/ApiClient";

export class BasketApi extends ApiClient {
  addItem(
    token: string | undefined,
    payload: AddBasketItemRequest,
  ): Promise<APIResponse> {
    return this.post("/api/BasketItems/", {
      headers: this.authorizationHeaders(token),
      data: payload,
    });
  }

  getBasket(basketId: string | number, token?: string): Promise<APIResponse> {
    return this.get(`/rest/basket/${basketId}`, {
      headers: this.authorizationHeaders(token),
    });
  }

  getItems(token: string): Promise<APIResponse> {
    return this.get("/api/BasketItems/", {
      headers: this.authorizationHeaders(token),
    });
  }

  updateItem(
    token: string,
    itemId: number,
    quantity: number,
  ): Promise<APIResponse> {
    return this.put(`/api/BasketItems/${itemId}`, {
      headers: this.authorizationHeaders(token),
      data: { quantity },
    });
  }

  deleteItem(token: string, itemId: number): Promise<APIResponse> {
    return this.delete(`/api/BasketItems/${itemId}`, {
      headers: this.authorizationHeaders(token),
    });
  }
}
