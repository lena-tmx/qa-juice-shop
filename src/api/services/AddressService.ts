import { APIRequestContext } from "@playwright/test";
import { ApiClient } from "../clients/ApiClient";
import { CreateAddressRequest, AddressResponse } from "../types/address.types";
import { step } from "@src/utils/step";

export class AddressService extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  @step()
  async getAll(token: string) {
    return this.get("/api/Addresss/", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  @step((token: string, payload: CreateAddressRequest) => `Create address: ${payload.fullName}`)
  async create(token: string, payload: CreateAddressRequest) {
    return this.post("/api/Addresss/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: payload,
    });
  }
}
