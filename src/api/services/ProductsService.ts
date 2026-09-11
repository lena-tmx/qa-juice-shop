import { ApiClient } from "../clients/ApiClient";
import { step } from "@src/utils/step";
import {
  productListResponseSchema,
  productResponseSchema,
} from "../schemas/products.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";
import type { Product } from "../types/products.types";

export class ProductsService extends ApiClient {
  @step("Get product catalog")
  async getAllResponse() {
    return this.get("/api/Products");
  }

  @step("Browse product catalog")
  async getAll(): Promise<Product[]> {
    const response = await this.getAllResponse();
    const body = await parseApiResponse(
      response,
      productListResponseSchema,
      [200],
    );
    return body.data;
  }

  @step((query: string) => `Get products matching search query: ${query}`)
  async searchResponse(query: string) {
    return this.get(`/rest/products/search?q=${encodeURIComponent(query)}`);
  }

  @step((query: string) => `Search catalog for: ${query}`)
  async search(query: string): Promise<Product[]> {
    const response = await this.searchResponse(query);
    const body = await parseApiResponse(
      response,
      productListResponseSchema,
      [200],
    );
    return body.data;
  }

  @step((id: number) => `Get product details by id: ${id}`)
  async getByIdResponse(id: number) {
    return this.get(`/api/Products/${id}`);
  }

  @step((id: number) => `Retrieve product information by id: ${id}`)
  async getById(id: number): Promise<Product> {
    const response = await this.getByIdResponse(id);
    const body = await parseApiResponse(response, productResponseSchema, [200]);
    return body.data;
  }
}
