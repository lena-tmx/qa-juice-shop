import { ApiClient } from "../clients/ApiClient";
import { CreateCardRequest } from "../types/card.types";
import type { CardResponse } from "../types/card.types";
import { step } from "@src/utils/step";
import {
  cardListResponseSchema,
  cardResponseSchema,
} from "../schemas/card.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";

export class CardService extends ApiClient {
  @step("Get saved payment cards")
  async getAllResponse(token: string) {
    return this.get("/api/Cards/", {
      headers: this.authorizationHeaders(token),
    });
  }

  @step("Retrieve saved payment cards")
  async getAll(token: string): Promise<CardResponse[]> {
    const response = await this.getAllResponse(token);
    const body = await parseApiResponse(
      response,
      cardListResponseSchema,
      [200],
    );
    return body.data;
  }

  @step(
    (token: string, payload: CreateCardRequest) =>
      `Add payment card for cardholder: ${payload.fullName}`,
  )
  async createResponse(token: string, payload: CreateCardRequest) {
    return this.post("/api/Cards/", {
      headers: this.authorizationHeaders(token, {
        "Content-Type": "application/json",
      }),
      data: payload,
    });
  }

  @step(
    (token: string, payload: CreateCardRequest) =>
      `Create payment card for cardholder: ${payload.fullName}`,
  )
  async create(
    token: string,
    payload: CreateCardRequest,
  ): Promise<CardResponse> {
    const response = await this.createResponse(token, payload);
    const body = await parseApiResponse(response, cardResponseSchema, [201]);
    return body.data;
  }
}
