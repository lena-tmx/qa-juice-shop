import { faker } from "@faker-js/faker";
import { users } from "@src/data/users";
import { TestData } from "@src/utils/TestData";
import { SecurityQuestions } from "@src/data/securityQuestions";

export interface TestUser {
  email: string;
  password: string;
  securityQuestion: {
    id: number;
    answer: string;
  };
}

const SECURITY_QUESTION_POOL = [
  { id: SecurityQuestions.MOTHERS_BIRTH_DATE.id, answer: "01/01/01" },
  { id: SecurityQuestions.FAVORITE_PET.id, answer: faker.animal.dog() },
  { id: SecurityQuestions.MOTHERS_MAIDEN_NAME.id, answer: faker.person.lastName() },
];

export function createTestUser(overrides?: Partial<TestUser>): TestUser {
  const sq = faker.helpers.arrayElement(SECURITY_QUESTION_POOL);

  return {
    email: TestData.getUniqueEmail(),
    password: users.validUser.password,
    securityQuestion: {
      id: sq.id,
      answer: sq.answer,
    },
    ...overrides,
  };
}
