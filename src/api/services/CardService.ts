import { APIRequestContext } from "@playwright/test";
import { ApiClient } from "../clients/ApiClient";
import { CreateCardRequest } from "../types/card.types";
import { step } from "@src/utils/step";

export class CardService extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  @step()
  async getAll(token: string) {
    return this.get("/api/Cards/", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  @step((token: string, payload: CreateCardRequest) => `Create card: ${payload.fullName}`)
  async create(token: string, payload: CreateCardRequest) {
    return this.post("/api/Cards/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }
}
