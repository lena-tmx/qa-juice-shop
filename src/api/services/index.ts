import { APIRequestContext } from "@playwright/test";
import { AuthService } from "./AuthService";
import { ProductsService } from "./ProductsService";
import { BasketService } from "./BasketSrvice";
import { AddressService } from "./AddressService";
import { CardService } from "./CardService";
import { FeedbackService } from "./FeedbackService";
import { OrderService } from "./OrderService";

export class ApiServices {
  readonly auth: AuthService;
  readonly products: ProductsService;
  readonly basket: BasketService;
  readonly address: AddressService;
  readonly card: CardService;
  readonly feedback: FeedbackService;
  readonly order: OrderService;

  constructor(request: APIRequestContext) {
    this.auth = new AuthService(request);
    this.products = new ProductsService(request);
    this.basket = new BasketService(request);
    this.address = new AddressService(request);
    this.card = new CardService(request);
    this.feedback = new FeedbackService(request);
    this.order = new OrderService(request);
  }
}
