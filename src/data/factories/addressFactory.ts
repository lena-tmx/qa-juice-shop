import { TestData } from "@src/utils/TestData";
import { CreateAddressRequest } from "@src/api/types/address.types";

export function createTestAddress(
  overrides?: Partial<CreateAddressRequest>,
): CreateAddressRequest {
  return {
    fullName: TestData.getFullName(),
    mobileNum: TestData.getPhone(),
    zipCode: TestData.getZipCode(),
    streetAddress: TestData.getStreetAddress(),
    city: TestData.getCity(),
    state: TestData.getState(),
    country: TestData.getCountry(),
    ...overrides,
  };
}
