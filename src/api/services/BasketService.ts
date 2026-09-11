import { step } from "@src/utils/step";
import type { BasketApi } from "../endpoints/BasketApi";
import {
  basketItemResponseSchema,
  basketItemsResponseSchema,
  basketResponseSchema,
} from "../schemas/basket.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";
import type {
  AddBasketItemRequest,
  Basket,
  BasketItemResponse,
} from "../types/basket.types";
import { BaseService } from "./BaseService";

export class BasketService extends BaseService {
  constructor(private readonly api: BasketApi) {
    super();
  }

  @step(
    (token: string | undefined, payload: AddBasketItemRequest) =>
      `Add product to basket by product id: ${payload.ProductId}`,
  )
  async addItem(
    token: string | undefined,
    payload: AddBasketItemRequest,
  ): Promise<BasketItemResponse> {
    return this.execute("Add product to basket", async () => {
      const response = await this.api.addItem(token, payload);
      const body = await parseApiResponse(
        response,
        basketItemResponseSchema,
        [200],
      );
      return body.data;
    });
  }

  @step(
    (basketId: string | number) =>
      `Retrieve basket contents by id: ${basketId}`,
  )
  async getBasket(basketId: string | number, token?: string): Promise<Basket> {
    return this.execute("Retrieve basket contents", async () => {
      const response = await this.api.getBasket(basketId, token);
      const body = await parseApiResponse(
        response,
        basketResponseSchema,
        [200],
      );
      return body.data;
    });
  }

  @step("Retrieve basket items")
  async getItems(token: string): Promise<BasketItemResponse[]> {
    return this.execute("Retrieve basket items", async () => {
      const response = await this.api.getItems(token);
      const body = await parseApiResponse(
        response,
        basketItemsResponseSchema,
        [200],
      );
      return body.data;
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
    return this.execute("Change basket item quantity", async () => {
      const response = await this.api.updateItem(token, itemId, quantity);
      const body = await parseApiResponse(
        response,
        basketItemResponseSchema,
        [200],
      );
      return body.data;
    });
  }

  @step(
    (token: string, itemId: number) => `Remove basket item by id: ${itemId}`,
  )
  async deleteItem(token: string, itemId: number): Promise<void> {
    return this.execute("Remove basket item", async () => {
      const response = await this.api.deleteItem(token, itemId);
      this.requireStatus("Remove basket item", response, 200);
    });
  }
}
