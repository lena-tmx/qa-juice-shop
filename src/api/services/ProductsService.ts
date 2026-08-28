import { APIRequestContext } from "@playwright/test";
import { ApiClient } from "../clients/ApiClient";
import { step } from "@src/utils/step";

export class ProductsService extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  @step("Browse product catalog")
  async getAll() {
    return this.get("/api/Products");
  }

  @step((query: string) => `Search catalog for: ${query}`)
  async search(query: string) {
    return this.get(`/rest/products/search?q=${encodeURIComponent(query)}`);
  }

  @step((id: number) => `View product details (id: ${id})`)
  async getById(id: number) {
    return this.get(`/api/Products/${id}`);
  }
}
