import type { APIResponse } from "@playwright/test";
import type { TestUser } from "@src/data/factories/userFactory";
import { ApiClient } from "../clients/ApiClient";

export class AuthApi extends ApiClient {
  register(user: TestUser): Promise<APIResponse> {
    return this.post("/api/Users/", {
      data: {
        email: user.email,
        password: user.password,
        passwordRepeat: user.password,
        securityQuestion: { id: user.securityQuestion.id },
        securityAnswer: user.securityQuestion.answer,
      },
    });
  }

  login(email: string, password: string): Promise<APIResponse> {
    return this.post("/rest/user/login", { data: { email, password } });
  }

  changePassword(
    token: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<APIResponse> {
    return this.get("/rest/user/change-password", {
      headers: this.authorizationHeaders(token),
      params: {
        current: currentPassword,
        new: newPassword,
        repeat: newPassword,
      },
    });
  }

  getSecurityQuestions(): Promise<APIResponse> {
    return this.get("/api/SecurityQuestions");
  }

  deleteUser(userId: number, adminToken: string): Promise<APIResponse> {
    return this.delete(`/api/Users/${userId}`, {
      headers: this.authorizationHeaders(adminToken),
    });
  }
}
