import type { JSONSchemaType } from "ajv";
import type { OrderHistoryResponse } from "../types/order.types";

export const orderHistoryResponseSchema: JSONSchemaType<OrderHistoryResponse> =
  {
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {},
          required: [],
          additionalProperties: true,
        },
      },
    },
    required: ["data"],
    additionalProperties: true,
  };
