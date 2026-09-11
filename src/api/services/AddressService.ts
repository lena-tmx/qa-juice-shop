import { step } from "@src/utils/step";
import type { AddressApi } from "../endpoints/AddressApi";
import {
  addressListResponseSchema,
  addressResponseSchema,
} from "../schemas/address.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";
import type {
  AddressResponse,
  CreateAddressRequest,
} from "../types/address.types";
import { BaseService } from "./BaseService";

export class AddressService extends BaseService {
  constructor(private readonly api: AddressApi) {
    super();
  }

  @step("Retrieve saved delivery addresses")
  async getAll(token: string): Promise<AddressResponse[]> {
    return this.execute("Retrieve saved delivery addresses", async () => {
      const response = await this.api.getAll(token);
      const body = await parseApiResponse(
        response,
        addressListResponseSchema,
        [200],
      );
      return body.data;
    });
  }

  @step(
    (token: string, payload: CreateAddressRequest) =>
      `Add delivery address for recipient: ${payload.fullName}`,
  )
  async create(
    token: string,
    payload: CreateAddressRequest,
  ): Promise<AddressResponse> {
    return this.execute("Add delivery address", async () => {
      const response = await this.api.create(token, payload);
      const body = await parseApiResponse(
        response,
        addressResponseSchema,
        [201],
      );
      return body.data;
    });
  }
}
