import { step } from "@src/utils/step";
import type { FeedbackApi } from "../endpoints/FeedbackApi";
import {
  captchaSchema,
  feedbackResponseSchema,
} from "../schemas/feedback.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";
import type {
  CaptchaResponse,
  CreateFeedbackRequest,
  FeedbackResponse,
} from "../types/feedback.types";
import { BaseService } from "./BaseService";

export class FeedbackService extends BaseService {
  constructor(private readonly api: FeedbackApi) {
    super();
  }

  @step("Retrieve CAPTCHA challenge for feedback form")
  async getCaptcha(token: string): Promise<CaptchaResponse> {
    return this.execute("Retrieve CAPTCHA challenge", async () => {
      const response = await this.api.getCaptcha(token);
      return parseApiResponse(response, captchaSchema, [200]);
    });
  }

  @step(
    (token: string, payload: CreateFeedbackRequest) =>
      `Submit feedback with rating: ${payload.rating}`,
  )
  async submit(
    token: string,
    payload: CreateFeedbackRequest,
  ): Promise<FeedbackResponse> {
    return this.execute("Submit feedback", async () => {
      const response = await this.api.submit(token, payload);
      const body = await parseApiResponse(
        response,
        feedbackResponseSchema,
        [201],
      );
      return body.data;
    });
  }

  @step(
    (token: string, comment: string, rating: number) =>
      `Submit feedback with valid CAPTCHA: ${rating} star rating`,
  )
  async submitWithCaptcha(
    token: string,
    comment: string,
    rating: number,
  ): Promise<FeedbackResponse> {
    const captcha = await this.getCaptcha(token);
    return this.submit(token, {
      comment,
      rating,
      captchaId: captcha.captchaId,
      captcha: captcha.answer,
    });
  }
}
