import type { JSONSchemaType } from "ajv";
import type {
  CaptchaResponse,
  FeedbackApiResponse,
  FeedbackResponse,
} from "../types/feedback.types";

const feedbackSchema: JSONSchemaType<FeedbackResponse> = {
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
    comment: { type: "string" },
    rating: { type: "integer", minimum: 1, maximum: 5 },
    UserId: { type: "integer", minimum: 1, nullable: true },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
  required: ["id", "comment", "rating", "createdAt", "updatedAt"],
  additionalProperties: true,
};

export const feedbackResponseSchema: JSONSchemaType<FeedbackApiResponse> = {
  type: "object",
  properties: { data: feedbackSchema },
  required: ["data"],
  additionalProperties: true,
};

export const captchaSchema: JSONSchemaType<CaptchaResponse> = {
  type: "object",
  properties: {
    captchaId: { type: "integer", minimum: 0 },
    captcha: { type: "string", minLength: 1 },
    answer: { type: "string", minLength: 1 },
  },
  required: ["captchaId", "captcha", "answer"],
  additionalProperties: true,
};
