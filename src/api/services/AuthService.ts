import { APIRequestContext } from "@playwright/test";
import { ApiClient } from "../clients/ApiClient";
import { createTestUser, type TestUser } from "@src/data/factories/userFactory";

export class AuthService extends ApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async register(user: TestUser) {
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

  async registerOrThrow(user: TestUser): Promise<void> {
    const response = await this.register(user);

    if (![200, 201].includes(response.status())) {
      const body = await response.text();
      throw new Error(
        `User registration failed. Status: ${response.status()}, body: ${body}`,
      );
    }
  }

  async login(email: string, password: string) {
    return this.post("/rest/user/login", {
      data: { email, password },
    });
  }

  async loginAndGetAuthData(email: string, password: string) {
    const response = await this.login(email, password);

    if (response.status() !== 200) {
      const body = await response.text();
      throw new Error(
        `Login failed. Status: ${response.status()}, body: ${body}`,
      );
    }

    const parsed = await response.json();

    return {
      token: parsed.token ?? parsed.authentication?.token,
      basketId: parsed.authentication?.bid,
      email: parsed.authentication?.umail,
      raw: parsed,
    };
  }

  async registerAndLogin(user: TestUser) {
    await this.registerOrThrow(user);
    return this.loginAndGetAuthData(user.email, user.password);
  }

  async createTestUser() {
    const user = createTestUser();
    await this.registerOrThrow(user);
    return user;
  }

  async createAndLoginTestUser() {
    const user = createTestUser();
    const auth = await this.registerAndLogin(user);

    return {
      user,
      auth,
    };
  }

  async whoami(token: string) {
    return this.get("/rest/user/whoami", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

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

  async getSecurityQuestions() {
    return this.get("/api/SecurityQuestions");
  }
}
