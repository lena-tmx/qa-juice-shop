import { APIRequestContext } from "@playwright/test";
import { ApiClient } from "../clients/ApiClient";
import { createTestUser, type TestUser } from "@src/data/factories/userFactory";
import { step } from "@src/utils/step";
import { loginResponseSchema } from "../schemas/api.schemas";
import { parseApiResponse } from "../schemas/parseApiResponse";
import { userResponseSchema } from "../schemas/api.schemas";
import { env } from "@src/utils/env";

export class AuthService extends ApiClient {
  private readonly createdUserIds = new Set<number>();

  constructor(request: APIRequestContext) {
    super(request);
  }

  @step((user: TestUser) => `Attempt to register user: ${user.email}`)
  async register(user: TestUser) {
    const response = await this.post("/api/Users/", {
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

    if ([200, 201].includes(response.status())) {
      const registered = await parseApiResponse(response, userResponseSchema);
      this.createdUserIds.add(registered.data.id);
    }

    return response;
  }

  @step((user: TestUser) => `Set up registered user: ${user.email}`)
  async registerOrThrow(user: TestUser): Promise<void> {
    const response = await this.register(user);

    if (![200, 201].includes(response.status())) {
      const body = await response.text();
      throw new Error(
        `User registration failed. Status: ${response.status()}, body: ${body}`,
      );
    }
  }

  @step((email: string, password: string) => `Log in with credentials: ${email}`)
  async login(email: string, password: string) {
    return this.post("/rest/user/login", {
      data: { email, password },
    });
  }

  @step((email: string, password: string) => `Log in and retrieve session token: ${email}`)
  async loginAndGetAuthData(email: string, password: string) {
    const response = await this.login(email, password);

    if (response.status() !== 200) {
      const body = await response.text();
      throw new Error(
        `Login failed. Status: ${response.status()}, body: ${body}`,
      );
    }

    const parsed = await parseApiResponse(response, loginResponseSchema);

    return {
      token: parsed.token ?? parsed.authentication?.token,
      basketId: parsed.authentication?.bid,
      email: parsed.authentication?.umail,
      raw: parsed,
    };
  }

  @step((user: TestUser) => `Register and log in user: ${user.email}`)
  async registerAndLogin(user: TestUser) {
    await this.registerOrThrow(user);
    return this.loginAndGetAuthData(user.email, user.password);
  }

  @step("Create test user")
  async createTestUser() {
    const user = createTestUser();
    await this.registerOrThrow(user);
    return user;
  }

  @step("Create test user and log in")
  async createAndLoginTestUser() {
    const user = createTestUser();
    const auth = await this.registerAndLogin(user);

    return {
      user,
      auth,
    };
  }

  @step("Retrieve current authenticated user")
  async whoami(token: string) {
    return this.get("/rest/user/whoami", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  @step("Change password")
  async changePassword(
    token: string,
    current: string,
    newPassword: string,
  ) {
    return this.get(
      `/rest/user/change-password?current=${encodeURIComponent(current)}&new=${encodeURIComponent(newPassword)}&repeat=${encodeURIComponent(newPassword)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  @step("Retrieve list of security questions")
  async getSecurityQuestions() {
    return this.get("/api/SecurityQuestions");
  }

  @step(
    (userId: number, _adminToken: string) =>
      `Delete test user (id: ${userId})`,
  )
  async deleteUser(userId: number, adminToken: string) {
    return this.delete(`/api/Users/${userId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
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

    const admin = await this.loginAndGetAuthData(
      env.cleanupAdminEmail,
      env.cleanupAdminPassword,
    );

    for (const userId of this.createdUserIds) {
      const response = await this.deleteUser(userId, admin.token);
      if (![200, 204].includes(response.status())) {
        throw new Error(
          `Test-user cleanup failed for user ${userId}: HTTP ${response.status()}`,
        );
      }
      this.createdUserIds.delete(userId);
    }
  }
}
