import { step } from "@src/utils/step";
import type { ProductsApi } from "../endpoints/ProductsApi";
import {
  productListResponseSchema,
  productResponseSchema,
} from "../schemas/products.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";
import type { Product } from "../types/products.types";
import { BaseService } from "./BaseService";

export class ProductsService extends BaseService {
  constructor(private readonly api: ProductsApi) {
    super();
  }

  @step("Browse product catalog")
  async getAll(): Promise<Product[]> {
    return this.execute("Browse product catalog", async () => {
      const response = await this.api.getAll();
      const body = await parseApiResponse(
        response,
        productListResponseSchema,
        [200],
      );
      return body.data;
    });
  }

  @step((query: string) => `Search catalog for: ${query}`)
  async search(query: string): Promise<Product[]> {
    return this.execute("Search product catalog", async () => {
      const response = await this.api.search(query);
      const body = await parseApiResponse(
        response,
        productListResponseSchema,
        [200],
      );
      return body.data;
    });
  }

  @step((id: number) => `Retrieve product information by id: ${id}`)
  async getById(id: number): Promise<Product> {
    return this.execute("Retrieve product information", async () => {
      const response = await this.api.getById(id);
      const body = await parseApiResponse(
        response,
        productResponseSchema,
        [200],
      );
      return body.data;
    });
  }
}
