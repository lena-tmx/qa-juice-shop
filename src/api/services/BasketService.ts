import { ApiClient } from "../clients/ApiClient";
import {
  BasketItemResponse,
  AddBasketItemRequest,
  Basket,
} from "../types/basket.types";
import { step } from "@src/utils/step";
import {
  basketItemResponseSchema,
  basketItemsResponseSchema,
  basketResponseSchema,
} from "../schemas/basket.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";

export class BasketService extends ApiClient {
  @step(
    (token: string | undefined, payload: AddBasketItemRequest) =>
      `Add product to basket by product id: ${payload.ProductId}`,
  )
  async addItemResponse(
    token: string | undefined,
    payload: AddBasketItemRequest,
  ) {
    return this.post("/api/BasketItems/", {
      headers: this.authorizationHeaders(token),
      data: payload,
    });
  }

  @step(
    (token: string | undefined, payload: AddBasketItemRequest) =>
      `Create basket item for product id: ${payload.ProductId}`,
  )
  async addItem(
    token: string | undefined,
    payload: AddBasketItemRequest,
  ): Promise<BasketItemResponse> {
    const response = await this.addItemResponse(token, payload);
    const body = await parseApiResponse(
      response,
      basketItemResponseSchema,
      [200, 201],
    );
    return body.data;
  }

  @step((basketId: string | number) => `Get basket contents by id: ${basketId}`)
  async getBasketResponse(basketId: string | number, token?: string) {
    return this.get(`/rest/basket/${basketId}`, {
      headers: this.authorizationHeaders(token),
    });
  }

  @step(
    (basketId: string | number) =>
      `Retrieve basket contents by id: ${basketId}`,
  )
  async getBasket(basketId: string | number, token?: string): Promise<Basket> {
    const response = await this.getBasketResponse(basketId, token);
    const body = await parseApiResponse(response, basketResponseSchema, [200]);
    return body.data;
  }

  @step("Get basket items")
  async getBasketItemsResponse(token: string) {
    return this.get("/api/BasketItems/", {
      headers: this.authorizationHeaders(token),
    });
  }

  @step("Retrieve basket items")
  async getBasketItems(token: string): Promise<BasketItemResponse[]> {
    const response = await this.getBasketItemsResponse(token);
    const body = await parseApiResponse(
      response,
      basketItemsResponseSchema,
      [200],
    );
    return body.data;
  }

  @step(
    (token: string, itemId: number, quantity: number) =>
      `Update basket item by id: ${itemId} to quantity: ${quantity}`,
  )
  async updateItemResponse(token: string, itemId: number, quantity: number) {
    return this.put(`/api/BasketItems/${itemId}`, {
      headers: this.authorizationHeaders(token),
      data: { quantity },
    });
  }

  @step(
    (token: string, itemId: number, quantity: number) =>
      `Change basket item quantity by id: ${itemId} to ${quantity}`,
  )
  async updateItem(
    token: string,
    itemId: number,
    quantity: number,
  ): Promise<BasketItemResponse> {
    const response = await this.updateItemResponse(token, itemId, quantity);
    const body = await parseApiResponse(
      response,
      basketItemResponseSchema,
      [200],
    );
    return body.data;
  }

  @step(
    (token: string, itemId: number) => `Delete basket item by id: ${itemId}`,
  )
  async deleteItemResponse(token: string, itemId: number) {
    return this.delete(`/api/BasketItems/${itemId}`, {
      headers: this.authorizationHeaders(token),
    });
  }

  @step(
    (token: string, itemId: number) => `Remove basket item by id: ${itemId}`,
  )
  async deleteItem(token: string, itemId: number): Promise<void> {
    const response = await this.deleteItemResponse(token, itemId);
    if (response.status() !== 200) {
      throw new Error(
        `Unable to remove basket item ${itemId}: received ${response.status()} ${response.statusText()}`,
      );
    }
  }
}
