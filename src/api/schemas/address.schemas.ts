import type { JSONSchemaType } from "ajv";
import type {
  AddressApiResponse,
  AddressListResponse,
  AddressResponse,
} from "../types/address.types";

const addressSchema: JSONSchemaType<AddressResponse> = {
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
    fullName: { type: "string", minLength: 1 },
    mobileNum: { type: "number" },
    zipCode: { type: "string", minLength: 1 },
    streetAddress: { type: "string", minLength: 1 },
    city: { type: "string", minLength: 1 },
    state: { type: "string" },
    country: { type: "string", minLength: 1 },
    UserId: { type: "integer", minimum: 1 },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
  required: [
    "id",
    "fullName",
    "mobileNum",
    "zipCode",
    "streetAddress",
    "city",
    "state",
    "country",
    "UserId",
    "createdAt",
    "updatedAt",
  ],
  additionalProperties: true,
};

export const addressResponseSchema: JSONSchemaType<AddressApiResponse> = {
  type: "object",
  properties: { data: addressSchema },
  required: ["data"],
  additionalProperties: true,
};

export const addressListResponseSchema: JSONSchemaType<AddressListResponse> = {
  type: "object",
  properties: { data: { type: "array", items: addressSchema } },
  required: ["data"],
  additionalProperties: true,
};
