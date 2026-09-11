import type { APIRequestContext } from "@playwright/test";
import { AddressApi } from "./AddressApi";
import { AuthApi } from "./AuthApi";
import { BasketApi } from "./BasketApi";
import { CardApi } from "./CardApi";
import { FeedbackApi } from "./FeedbackApi";
import { OrderApi } from "./OrderApi";
import { ProductsApi } from "./ProductsApi";

export class ApiEndpoints {
  readonly address: AddressApi;
  readonly auth: AuthApi;
  readonly basket: BasketApi;
  readonly card: CardApi;
  readonly feedback: FeedbackApi;
  readonly order: OrderApi;
  readonly products: ProductsApi;

  constructor(request: APIRequestContext) {
    this.address = new AddressApi(request);
    this.auth = new AuthApi(request);
    this.basket = new BasketApi(request);
    this.card = new CardApi(request);
    this.feedback = new FeedbackApi(request);
    this.order = new OrderApi(request);
    this.products = new ProductsApi(request);
  }
}
