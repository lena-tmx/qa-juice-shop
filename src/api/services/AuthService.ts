import { createTestUser, type TestUser } from "@src/data/factories/userFactory";
import { env } from "@src/utils/env";
import { step } from "@src/utils/step";
import type { AuthApi } from "../endpoints/AuthApi";
import {
  loginResponseSchema,
  securityQuestionsResponseSchema,
  userResponseSchema,
} from "../schemas/auth.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";
import type {
  AuthData,
  SecurityQuestionResponse,
  User,
} from "../types/auth.types";
import { BaseService } from "./BaseService";

export class AuthService extends BaseService {
  private readonly createdUserIds = new Set<number>();

  constructor(private readonly api: AuthApi) {
    super();
  }

  @step((user: TestUser) => `Register user: ${user.email}`)
  async register(user: TestUser): Promise<User> {
    return this.execute("Register user", async () => {
      const response = await this.api.register(user);
      const registered = await parseApiResponse(
        response,
        userResponseSchema,
        [201],
      );
      this.createdUserIds.add(registered.data.id);
      return registered.data;
    });
  }

  @step(
    (email: string, _password: string) =>
      `Log in and retrieve session token: ${email}`,
  )
  async login(email: string, password: string): Promise<AuthData> {
    return this.execute("Log in user", async () => {
      const response = await this.api.login(email, password);
      const parsed = await parseApiResponse(
        response,
        loginResponseSchema,
        [200],
      );
      return {
        token: parsed.token ?? parsed.authentication.token,
        basketId: parsed.authentication.bid,
        email: parsed.authentication.umail,
      };
    });
  }

  @step((user: TestUser) => `Register and log in user: ${user.email}`)
  async registerAndLogin(user: TestUser): Promise<AuthData> {
    await this.register(user);
    return this.login(user.email, user.password);
  }

  @step("Create test user")
  async createTestUser(): Promise<TestUser> {
    const user = createTestUser();
    await this.register(user);
    return user;
  }

  @step("Change password")
  async changePassword(
    token: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    return this.execute("Change password", async () => {
      const response = await this.api.changePassword(
        token,
        currentPassword,
        newPassword,
      );
      this.requireStatus("Change password", response, 200);
    });
  }

  @step("Retrieve list of security questions")
  async getSecurityQuestions(): Promise<SecurityQuestionResponse[]> {
    return this.execute("Retrieve list of security questions", async () => {
      const response = await this.api.getSecurityQuestions();
      const body = await parseApiResponse(
        response,
        securityQuestionsResponseSchema,
        [200],
      );
      return body.data;
    });
  }

  async cleanupCreatedUsers(): Promise<void> {
    if (this.createdUserIds.size === 0) return;

    if (!env.cleanupAdminEmail || !env.cleanupAdminPassword) {
      if (!env.ci) {
        console.warn(
          "Test-user cleanup skipped: set TEST_CLEANUP_ADMIN_EMAIL and TEST_CLEANUP_ADMIN_PASSWORD for persistent environments.",
        );
      }
      return;
    }

    await this.execute("Clean up test users", async () => {
      const admin = await this.login(
        env.cleanupAdminEmail!,
        env.cleanupAdminPassword!,
      );

      for (const userId of this.createdUserIds) {
        const response = await this.api.deleteUser(userId, admin.token);
        if (![200, 204].includes(response.status())) {
          throw new Error(
            `Delete test user by id ${userId} expected HTTP 200 or 204, but received HTTP ${response.status()} ${response.statusText()}`,
          );
        }
        this.createdUserIds.delete(userId);
      }
    });
  }
}
