import type { JSONSchemaType } from "ajv";
import type {
  CardApiResponse,
  CardListResponse,
  CardResponse,
} from "../types/card.types";

const cardSchema: JSONSchemaType<CardResponse> = {
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
    fullName: { type: "string", minLength: 1 },
    cardNum: { type: "number" },
    expMonth: { type: "integer", minimum: 1, maximum: 12 },
    expYear: { type: "integer" },
    UserId: { type: "integer", minimum: 1 },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
  required: [
    "id",
    "fullName",
    "cardNum",
    "expMonth",
    "expYear",
    "UserId",
    "createdAt",
    "updatedAt",
  ],
  additionalProperties: true,
};

export const cardResponseSchema: JSONSchemaType<CardApiResponse> = {
  type: "object",
  properties: { data: cardSchema },
  required: ["data"],
  additionalProperties: true,
};

export const cardListResponseSchema: JSONSchemaType<CardListResponse> = {
  type: "object",
  properties: { data: { type: "array", items: cardSchema } },
  required: ["data"],
  additionalProperties: true,
};
