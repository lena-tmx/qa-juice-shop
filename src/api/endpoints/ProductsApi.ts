import type { APIResponse } from "@playwright/test";
import { ApiClient } from "../clients/ApiClient";

export class ProductsApi extends ApiClient {
  getAll(): Promise<APIResponse> {
    return this.get("/api/Products");
  }

  search(query: string): Promise<APIResponse> {
    return this.get(`/rest/products/search?q=${encodeURIComponent(query)}`);
  }

  getById(id: number): Promise<APIResponse> {
    return this.get(`/api/Products/${id}`);
  }
}
