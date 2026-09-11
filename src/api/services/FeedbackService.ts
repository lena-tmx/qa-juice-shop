import { ApiClient } from "../clients/ApiClient";
import {
  CreateFeedbackRequest,
  CaptchaResponse,
  FeedbackResponse,
} from "../types/feedback.types";
import { step } from "@src/utils/step";
import {
  captchaSchema,
  feedbackResponseSchema,
} from "../schemas/feedback.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";

export class FeedbackService extends ApiClient {
  @step("Get CAPTCHA challenge")
  async getCaptchaResponse(token: string) {
    return this.get("/rest/captcha/", {
      headers: this.authorizationHeaders(token),
    });
  }

  @step("Retrieve CAPTCHA challenge for feedback form")
  async getCaptcha(token: string): Promise<CaptchaResponse> {
    const response = await this.getCaptchaResponse(token);
    return parseApiResponse(response, captchaSchema, [200]);
  }

  @step(
    (token: string, payload: CreateFeedbackRequest) =>
      `Send feedback with rating: ${payload.rating}`,
  )
  async submitResponse(token: string, payload: CreateFeedbackRequest) {
    return this.post("/api/Feedbacks/", {
      headers: this.authorizationHeaders(token, {
        "Content-Type": "application/json",
      }),
      data: payload,
    });
  }

  @step(
    (token: string, payload: CreateFeedbackRequest) =>
      `Create feedback with rating: ${payload.rating}`,
  )
  async submit(
    token: string,
    payload: CreateFeedbackRequest,
  ): Promise<FeedbackResponse> {
    const response = await this.submitResponse(token, payload);
    const body = await parseApiResponse(
      response,
      feedbackResponseSchema,
      [201],
    );
    return body.data;
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
