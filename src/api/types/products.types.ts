export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface ProductsResponse {
  data: Product[];
}

export interface ProductResponse {
  data: Product;
}
