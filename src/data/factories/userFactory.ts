import { faker } from "@faker-js/faker";
import { users } from "@src/data/users";
import { TestData } from "@src/utils/TestData";
import { SecurityQuestions } from "@src/data/securityQuestions";

export interface TestUser {
  email: string;
  password: string;
  securityQuestion: {
    id: number;
    text: string;
    answer: string;
  };
}

type SecurityQuestion =
  (typeof SecurityQuestions)[keyof typeof SecurityQuestions];

interface CreateTestUserOptions {
  email?: string;
  password?: string;
  securityQuestion?: SecurityQuestion;
}

function formatBirthDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}

const SECURITY_QUESTION_POOL: readonly SecurityQuestion[] =
  Object.values(SecurityQuestions);

function createSecurityAnswer(question: SecurityQuestion): string {
  if (
    question.id === SecurityQuestions.MOTHERS_BIRTH_DATE.id ||
    question.id === SecurityQuestions.FATHERS_BIRTH_DATE.id
  ) {
    return formatBirthDate(faker.date.birthdate());
  }

  if (question.id === SecurityQuestions.CUSTOMER_ID_NUMBER.id) {
    return faker.string.numeric(10);
  }

  return faker.word.words({ count: { min: 1, max: 3 } });
}

function createTestSecurityQuestion(
  question: SecurityQuestion = faker.helpers.arrayElement(
    SECURITY_QUESTION_POOL,
  ),
): TestUser["securityQuestion"] {
  return {
    ...question,
    answer: createSecurityAnswer(question),
  };
}

export function createTestUser(options?: CreateTestUserOptions): TestUser {
  return {
    email: options?.email ?? TestData.getUniqueEmail(),
    password: options?.password ?? users.validUser.password,
    securityQuestion: createTestSecurityQuestion(options?.securityQuestion),
  };
}
