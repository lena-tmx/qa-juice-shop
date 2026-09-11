import type { APIResponse } from "@playwright/test";
import type { CreateAddressRequest } from "../types/address.types";
import { ApiClient } from "../clients/ApiClient";

export class AddressApi extends ApiClient {
  getAll(token: string): Promise<APIResponse> {
    return this.get("/api/Addresss/", {
      headers: this.authorizationHeaders(token),
    });
  }

  create(token: string, payload: CreateAddressRequest): Promise<APIResponse> {
    return this.post("/api/Addresss/", {
      headers: this.authorizationHeaders(token, {
        "Content-Type": "application/json",
      }),
      data: payload,
    });
  }
}
