import { step } from "@src/utils/step";
import type { CardApi } from "../endpoints/CardApi";
import {
  cardListResponseSchema,
  cardResponseSchema,
} from "../schemas/card.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";
import type { CardResponse, CreateCardRequest } from "../types/card.types";
import { BaseService } from "./BaseService";

export class CardService extends BaseService {
  constructor(private readonly api: CardApi) {
    super();
  }

  @step("Retrieve saved payment cards")
  async getAll(token: string): Promise<CardResponse[]> {
    return this.execute("Retrieve saved payment cards", async () => {
      const response = await this.api.getAll(token);
      const body = await parseApiResponse(
        response,
        cardListResponseSchema,
        [200],
      );
      return body.data;
    });
  }

  @step(
    (token: string, payload: CreateCardRequest) =>
      `Add payment card for cardholder: ${payload.fullName}`,
  )
  async create(
    token: string,
    payload: CreateCardRequest,
  ): Promise<CardResponse> {
    return this.execute("Add payment card", async () => {
      const response = await this.api.create(token, payload);
      const body = await parseApiResponse(response, cardResponseSchema, [201]);
      return body.data;
    });
  }
}
