export interface AddBasketItemRequest {
  ProductId: number;
  BasketId?: string | number;
  quantity: number;
}

export interface BasketItemResponse {
  ProductId: number;
  BasketId: number;
  id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface BasketItemApiResponse {
  data: BasketItemResponse;
}

export interface BasketItemsResponse {
  data: BasketItemResponse[];
}

export interface Basket {
  id: number;
  Products: object[];
}

export interface BasketResponse {
  data: Basket;
}
