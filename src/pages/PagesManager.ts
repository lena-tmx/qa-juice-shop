import { Page } from "@playwright/test";
import { HomePage } from "./HomePage";
import { LoginPage } from "./LoginPage";
import { BasketPage } from "./BasketPage";

export class PagesManager {
  constructor(private readonly page: Page) {}

  private _homePage?: HomePage;
  private _loginPage?: LoginPage;
  private _basketPage?: BasketPage;

  get homePage(): HomePage {
    if (!this._homePage) {
      this._homePage = new HomePage(this.page);
    }
    return this._homePage;
  }

  get loginPage(): LoginPage {
    if (!this._loginPage) {
      this._loginPage = new LoginPage(this.page);
    }
    return this._loginPage;
  }

  get basketPage(): BasketPage {
    if (!this._basketPage) {
      this._basketPage = new BasketPage(this.page);
    }
    return this._basketPage;
  }
}
