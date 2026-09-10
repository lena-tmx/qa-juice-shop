import { ApiClient } from "../clients/ApiClient";
import { createTestUser, type TestUser } from "@src/data/factories/userFactory";
import { step } from "@src/utils/step";
import {
  loginResponseSchema,
  securityQuestionsResponseSchema,
  userResponseSchema,
} from "../schemas/auth.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";
import { env } from "@src/utils/env";
import type {
  AuthData,
  SecurityQuestionResponse,
  User,
} from "../types/auth.types";

export class AuthService extends ApiClient {
  private readonly createdUserIds = new Set<number>();

  @step((user: TestUser) => `Attempt to register user: ${user.email}`)
  async registerResponse(user: TestUser) {
    return this.post("/api/Users/", {
      data: {
        email: user.email,
        password: user.password,
        passwordRepeat: user.password,
        securityQuestion: {
          id: user.securityQuestion.id,
        },
        securityAnswer: user.securityQuestion.answer,
      },
    });
  }

  @step((user: TestUser) => `Register user: ${user.email}`)
  async register(user: TestUser): Promise<User> {
    const response = await this.registerResponse(user);
    const registered = await parseApiResponse(
      response,
      userResponseSchema,
      [200, 201],
    );
    this.createdUserIds.add(registered.data.id);
    return registered.data;
  }

  @step(
    (email: string, _password: string) => `Log in with credentials: ${email}`,
  )
  async loginResponse(email: string, password: string) {
    return this.post("/rest/user/login", {
      data: { email, password },
    });
  }

  @step(
    (email: string, _password: string) =>
      `Log in and retrieve session token: ${email}`,
  )
  async login(email: string, password: string): Promise<AuthData> {
    const response = await this.loginResponse(email, password);
    const parsed = await parseApiResponse(response, loginResponseSchema, [200]);

    const token = parsed.token ?? parsed.authentication.token;

    return {
      token,
      basketId: parsed.authentication.bid,
      email: parsed.authentication.umail,
    };
  }

  @step((user: TestUser) => `Register and log in user: ${user.email}`)
  async registerAndLogin(user: TestUser) {
    await this.register(user);
    return this.login(user.email, user.password);
  }

  @step("Create test user")
  async createTestUser() {
    const user = createTestUser();
    await this.register(user);
    return user;
  }

  @step("Change password (raw API response)")
  async changePasswordResponse(
    token: string,
    current: string,
    newPassword: string,
  ) {
    return this.get(
      `/rest/user/change-password?current=${encodeURIComponent(current)}&new=${encodeURIComponent(newPassword)}&repeat=${encodeURIComponent(newPassword)}`,
      {
        headers: this.authorizationHeaders(token),
      },
    );
  }

  @step("Change password")
  async changePassword(
    token: string,
    current: string,
    newPassword: string,
  ): Promise<void> {
    const response = await this.changePasswordResponse(
      token,
      current,
      newPassword,
    );
    if (response.status() !== 200) {
      throw new Error(
        `Password change failed: received ${response.status()} ${response.statusText()}`,
      );
    }
  }

  @step("Retrieve list of security questions (raw API response)")
  async getSecurityQuestionsResponse() {
    return this.get("/api/SecurityQuestions");
  }

  @step("Retrieve list of security questions")
  async getSecurityQuestions(): Promise<SecurityQuestionResponse[]> {
    const response = await this.getSecurityQuestionsResponse();
    const body = await parseApiResponse(
      response,
      securityQuestionsResponseSchema,
      [200],
    );
    return body.data;
  }

  @step(
    (userId: number, _adminToken: string) => `Delete test user (id: ${userId})`,
  )
  async deleteUserResponse(userId: number, adminToken: string) {
    return this.delete(`/api/Users/${userId}`, {
      headers: this.authorizationHeaders(adminToken),
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

    const admin = await this.login(
      env.cleanupAdminEmail,
      env.cleanupAdminPassword,
    );

    for (const userId of this.createdUserIds) {
      const response = await this.deleteUserResponse(userId, admin.token);
      if (![200, 204].includes(response.status())) {
        throw new Error(
          `Test-user cleanup failed for user ${userId}: HTTP ${response.status()}`,
        );
      }
      this.createdUserIds.delete(userId);
    }
  }
}
