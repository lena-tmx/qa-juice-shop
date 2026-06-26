import { APIRequestContext } from "@playwright/test";
import { ApiClient } from "../clients/ApiClient";
import { CreateFeedbackRequest, CaptchaResponse } from "../types/feedback.types";
import { step } from "@src/utils/step";

export class FeedbackService extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  @step()
  async getCaptcha(token: string): Promise<CaptchaResponse> {
    const response = await this.get("/rest/captcha/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }

  @step()
  async submit(token: string, payload: CreateFeedbackRequest) {
    return this.post("/api/Feedbacks/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }

  @step("Submit feedback with captcha")
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
