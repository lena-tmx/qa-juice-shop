import type { JSONSchemaType } from "ajv";
import type {
  BasketItemApiResponse,
  BasketItemResponse,
  BasketItemsResponse,
  BasketResponse,
} from "../types/basket.types";

export const basketItemSchema: JSONSchemaType<BasketItemResponse> = {
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
    ProductId: { type: "integer", minimum: 1 },
    BasketId: { type: "integer", minimum: 1 },
    quantity: { type: "integer", minimum: 0 },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
  required: [
    "id",
    "ProductId",
    "BasketId",
    "quantity",
    "createdAt",
    "updatedAt",
  ],
  additionalProperties: true,
};

export const basketItemResponseSchema: JSONSchemaType<BasketItemApiResponse> = {
  type: "object",
  properties: { data: basketItemSchema },
  required: ["data"],
  additionalProperties: true,
};

export const basketItemsResponseSchema: JSONSchemaType<BasketItemsResponse> = {
  type: "object",
  properties: { data: { type: "array", items: basketItemSchema } },
  required: ["data"],
  additionalProperties: true,
};

export const basketResponseSchema: JSONSchemaType<BasketResponse> = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        id: { type: "integer", minimum: 1 },
        Products: {
          type: "array",
          items: {
            type: "object",
            properties: {},
            required: [],
            additionalProperties: true,
          },
        },
      },
      required: ["id", "Products"],
      additionalProperties: true,
    },
  },
  required: ["data"],
  additionalProperties: true,
};
