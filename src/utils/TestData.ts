import { faker } from "@faker-js/faker";

export class TestData {
  static getUniqueEmail(): string {
    return faker.internet.email({ provider: "qa-test.example" });
  }

  static getFullName(): string {
    return faker.person.fullName();
  }

  static getPhone(): number {
    return Number(faker.string.numeric(10));
  }

  static getZipCode(): string {
    return faker.location.zipCode("#####");
  }

  static getStreetAddress(): string {
    return faker.location.streetAddress();
  }

  static getCity(): string {
    return faker.location.city();
  }

  static getState(): string {
    return faker.location.state({ abbreviated: true });
  }

  static getCountry(): string {
    return faker.location.country();
  }

  static getCardNumber(): number {
    return Number(faker.finance.creditCardNumber("################"));
  }

  static getFutureYear(): number {
    return faker.number.int({ min: 2080, max: 2099 });
  }

  static getFeedbackComment(): string {
    return faker.lorem.sentence();
  }

  static getRating(): number {
    return faker.number.int({ min: 1, max: 5 });
  }
}
