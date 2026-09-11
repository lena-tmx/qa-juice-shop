import { ApiClient } from "../clients/ApiClient";
import { CreateAddressRequest } from "../types/address.types";
import type { AddressResponse } from "../types/address.types";
import { step } from "@src/utils/step";
import {
  addressListResponseSchema,
  addressResponseSchema,
} from "../schemas/address.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";

export class AddressService extends ApiClient {
  @step("Get saved delivery addresses")
  async getAllResponse(token: string) {
    return this.get("/api/Addresss/", {
      headers: this.authorizationHeaders(token),
    });
  }

  @step("Retrieve saved delivery addresses")
  async getAll(token: string): Promise<AddressResponse[]> {
    const response = await this.getAllResponse(token);
    const body = await parseApiResponse(
      response,
      addressListResponseSchema,
      [200],
    );
    return body.data;
  }

  @step(
    (token: string, payload: CreateAddressRequest) =>
      `Add delivery address for recipient: ${payload.fullName}`,
  )
  async createResponse(token: string, payload: CreateAddressRequest) {
    return this.post("/api/Addresss/", {
      headers: this.authorizationHeaders(token, {
        "Content-Type": "application/json",
      }),
      data: payload,
    });
  }

  @step(
    (token: string, payload: CreateAddressRequest) =>
      `Create delivery address for recipient: ${payload.fullName}`,
  )
  async create(
    token: string,
    payload: CreateAddressRequest,
  ): Promise<AddressResponse> {
    const response = await this.createResponse(token, payload);
    const body = await parseApiResponse(response, addressResponseSchema, [201]);
    return body.data;
  }
}
