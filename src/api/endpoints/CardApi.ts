import type { APIResponse } from "@playwright/test";
import type { CreateCardRequest } from "../types/card.types";
import { ApiClient } from "../clients/ApiClient";

export class CardApi extends ApiClient {
  getAll(token: string): Promise<APIResponse> {
    return this.get("/api/Cards/", {
      headers: this.authorizationHeaders(token),
    });
  }

  create(token: string, payload: CreateCardRequest): Promise<APIResponse> {
    return this.post("/api/Cards/", {
      headers: this.authorizationHeaders(token, {
        "Content-Type": "application/json",
      }),
      data: payload,
    });
  }
}
