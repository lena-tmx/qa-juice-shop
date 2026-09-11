import type { Api } from "../endpoints";
import { AddressService } from "./AddressService";
import { AuthService } from "./AuthService";
import { BasketService } from "./BasketService";
import { CardService } from "./CardService";
import { FeedbackService } from "./FeedbackService";
import { OrderService } from "./OrderService";
import { ProductsService } from "./ProductsService";

export class Services {
  readonly address: AddressService;
  readonly auth: AuthService;
  readonly basket: BasketService;
  readonly card: CardService;
  readonly feedback: FeedbackService;
  readonly order: OrderService;
  readonly products: ProductsService;

  constructor(api: Api) {
    this.address = new AddressService(api.address);
    this.auth = new AuthService(api.auth);
    this.basket = new BasketService(api.basket);
    this.card = new CardService(api.card);
    this.feedback = new FeedbackService(api.feedback);
    this.order = new OrderService(api.order);
    this.products = new ProductsService(api.products);
  }

  async cleanup(): Promise<void> {
    await this.auth.cleanupCreatedUsers();
  }
}
