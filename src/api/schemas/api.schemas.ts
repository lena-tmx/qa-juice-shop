import type { JSONSchemaType } from "ajv";

interface Product {
  id: number;
  name: string;
  price: number;
}
interface ProductListResponse {
  data: Product[];
}
interface ProductResponse {
  data: Product;
}
interface BasketItem {
  id: number;
  ProductId: number;
  BasketId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
interface BasketItemResponse {
  data: BasketItem;
}
interface BasketItemsResponse {
  data: BasketItem[];
}
interface BasketResponse {
  data: { id: number; Products: object[] };
}
interface LoginResponse {
  authentication: { token: string; bid: number; umail?: string };
  token?: string;
}
interface UserResponse {
  data: { id: number; email: string };
}
interface SecurityQuestionsResponse {
  data: Array<{ question: string }>;
}
interface AddressResponse {
  data: { fullName: string; city: string; country: string };
}
interface UnknownListResponse {
  data: object[];
}
interface CardResponse {
  data: { fullName: string; expMonth: number };
}
interface FeedbackResponse {
  data: { comment: string; rating: number };
}
interface Captcha {
  captchaId: number;
  captcha: string;
  answer: string;
}

export const productSchema: JSONSchemaType<Product> = {
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
    name: { type: "string", minLength: 1 },
    price: { type: "number", minimum: 0 },
  },
  required: ["id", "name", "price"],
  additionalProperties: true,
};

export const productListResponseSchema: JSONSchemaType<ProductListResponse> = {
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

export const basketItemSchema: JSONSchemaType<BasketItem> = {
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

export const basketItemResponseSchema: JSONSchemaType<BasketItemResponse> = {
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

export const loginResponseSchema: JSONSchemaType<LoginResponse> = {
  type: "object",
  properties: {
    authentication: {
      type: "object",
      properties: {
        token: { type: "string", minLength: 1 },
        bid: { type: "integer", minimum: 1 },
        umail: { type: "string", format: "email", nullable: true },
      },
      required: ["token", "bid"],
      additionalProperties: true,
    },
    token: { type: "string", minLength: 1, nullable: true },
  },
  required: ["authentication"],
  additionalProperties: true,
};

export const userResponseSchema: JSONSchemaType<UserResponse> = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        id: { type: "integer", minimum: 1 },
        email: { type: "string", format: "email" },
      },
      required: ["id", "email"],
      additionalProperties: true,
    },
  },
  required: ["data"],
  additionalProperties: true,
};

export const securityQuestionsResponseSchema: JSONSchemaType<SecurityQuestionsResponse> =
  {
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          type: "object",
          properties: { question: { type: "string", minLength: 1 } },
          required: ["question"],
          additionalProperties: true,
        },
      },
    },
    required: ["data"],
    additionalProperties: true,
  };

export const addressResponseSchema: JSONSchemaType<AddressResponse> = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        fullName: { type: "string", minLength: 1 },
        city: { type: "string", minLength: 1 },
        country: { type: "string", minLength: 1 },
      },
      required: ["fullName", "city", "country"],
      additionalProperties: true,
    },
  },
  required: ["data"],
  additionalProperties: true,
};

const unknownListResponseSchema: JSONSchemaType<UnknownListResponse> = {
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

export const addressListResponseSchema = unknownListResponseSchema;

export const cardResponseSchema: JSONSchemaType<CardResponse> = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        fullName: { type: "string", minLength: 1 },
        expMonth: { type: "integer", minimum: 1, maximum: 12 },
      },
      required: ["fullName", "expMonth"],
      additionalProperties: true,
    },
  },
  required: ["data"],
  additionalProperties: true,
};

export const cardListResponseSchema = unknownListResponseSchema;

export const feedbackResponseSchema: JSONSchemaType<FeedbackResponse> = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        comment: { type: "string" },
        rating: { type: "integer", minimum: 1, maximum: 5 },
      },
      required: ["comment", "rating"],
      additionalProperties: true,
    },
  },
  required: ["data"],
  additionalProperties: true,
};

export const orderHistoryResponseSchema = unknownListResponseSchema;

export const captchaSchema: JSONSchemaType<Captcha> = {
  type: "object",
  properties: {
    captchaId: { type: "integer", minimum: 0 },
    captcha: { type: "string", minLength: 1 },
    answer: { type: "string", minLength: 1 },
  },
  required: ["captchaId", "captcha", "answer"],
  additionalProperties: true,
};
