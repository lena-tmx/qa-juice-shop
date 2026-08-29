import { APIRequestContext } from "@playwright/test";
import { ApiClient } from "../clients/ApiClient";
import {
  CreateFeedbackRequest,
  CaptchaResponse,
} from "../types/feedback.types";
import { step } from "@src/utils/step";
import { captchaSchema } from "../schemas/api.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";

export class FeedbackService extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  @step("Request CAPTCHA challenge for feedback form")
  async getCaptcha(token: string): Promise<CaptchaResponse> {
    const response = await this.get("/rest/captcha/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return parseApiResponse(response, captchaSchema);
  }

  @step(
    (token: string, payload: CreateFeedbackRequest) =>
      `Submit feedback: ${payload.rating} star rating`,
  )
  async submit(token: string, payload: CreateFeedbackRequest) {
    return this.post("/api/Feedbacks/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }

  @step(
    (token: string, comment: string, rating: number) =>
      `Submit feedback with valid CAPTCHA: ${rating} star rating`,
  )
  async submitWithCaptcha(token: string, comment: string, rating: number) {
    const captcha = await this.getCaptcha(token);
    return this.submit(token, {
      comment,
      rating,
      captchaId: captcha.captchaId,
      captcha: captcha.answer,
    });
  }
}
