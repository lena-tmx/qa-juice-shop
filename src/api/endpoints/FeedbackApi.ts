import type { APIResponse } from "@playwright/test";
import type { CreateFeedbackRequest } from "../types/feedback.types";
import { ApiClient } from "../clients/ApiClient";

export class FeedbackApi extends ApiClient {
  getCaptcha(token: string): Promise<APIResponse> {
    return this.get("/rest/captcha/", {
      headers: this.authorizationHeaders(token),
    });
  }

  submit(token: string, payload: CreateFeedbackRequest): Promise<APIResponse> {
    return this.post("/api/Feedbacks/", {
      headers: this.authorizationHeaders(token, {
        "Content-Type": "application/json",
      }),
      data: payload,
    });
  }
}
