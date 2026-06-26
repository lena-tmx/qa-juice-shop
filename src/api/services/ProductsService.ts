import { APIRequestContext } from "@playwright/test";
import { ApiClient } from "../clients/ApiClient";

export class ProductsService extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async getAll() {
    return this.get("/api/Products");
  }

  async search(query: string) {
    return this.get(`/rest/products/search?q=${encodeURIComponent(query)}`);
  }

  async getById(id: number) {
    return this.get(`/api/Products/${id}`);
  }
}
