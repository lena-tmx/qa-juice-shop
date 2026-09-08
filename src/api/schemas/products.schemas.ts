import type { JSONSchemaType } from "ajv";
import type {
  Product,
  ProductResponse,
  ProductsResponse,
} from "../types/products.types";

export const productSchema: JSONSchemaType<Product> = {
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
    name: { type: "string", minLength: 1 },
    description: { type: "string", minLength: 1 },
    price: { type: "number", minimum: 0 },
  },
  required: ["id", "name", "description", "price"],
  additionalProperties: true,
};

export const productListResponseSchema: JSONSchemaType<ProductsResponse> = {
  type: "object",
  properties: { data: { type: "array", items: productSchema } },
  required: ["data"],
  additionalProperties: true,
};

export const productResponseSchema: JSONSchemaType<ProductResponse> = {
  type: "object",
  properties: { data: productSchema },
  required: ["data"],
  additionalProperties: true,
};
