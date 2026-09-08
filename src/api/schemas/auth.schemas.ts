import type { JSONSchemaType } from "ajv";
import type {
  LoginResponse,
  SecurityQuestionsResponse,
  UserResponse,
} from "../types/auth.types";

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
