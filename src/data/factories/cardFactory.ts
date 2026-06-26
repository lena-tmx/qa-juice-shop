import { faker } from "@faker-js/faker";
import { TestData } from "@src/utils/TestData";
import { CreateCardRequest } from "@src/api/types/card.types";

const VALID_CARD_NUMBERS = [
  4111111111111111,
  4222222222222222,
  5500000000000004,
];

export function createTestCard(
  overrides?: Partial<CreateCardRequest>,
): CreateCardRequest {
  return {
    fullName: TestData.getFullName(),
    cardNum: faker.helpers.arrayElement(VALID_CARD_NUMBERS),
    expMonth: faker.number.int({ min: 1, max: 12 }),
    expYear: TestData.getFutureYear(),
    ...overrides,
  };
}
