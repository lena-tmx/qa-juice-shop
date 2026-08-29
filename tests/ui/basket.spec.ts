import { qase } from 'playwright-qase-reporter';
import { users } from "@src/data/users";
import { TestData } from "@src/utils/TestData";
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe(`Basket UI`, () => {
  let newUser: { email: string; password: string };
  let productName = "Carrot Juice";

  test.beforeEach("Register test user via API", async ({ api }) => {
    newUser = {
      email: TestData.getUniqueEmail(),
      password: users.validUser.password,
    };

    newUser = await api.auth.createTestUser();
  });

  test(
    qase(83, `should add product to basket and see it there`),
    { tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.BASKET] },
    async ({ pages }) => {
      await pages.homePage.open();
      await pages.loginPage.open();
      await pages.loginPage.login(newUser.email, newUser.password);
      await pages.homePage.expectLoaded();

      await pages.homePage.addProductToBasket(productName);

      await pages.homePage.navbar.openBasket();
      await pages.basketPage.expectLoaded();
      await pages.basketPage.expectProductInBasket(productName);
    },
  );

  test(
    qase(84, `should add and remove product to basket and see it empty`),
    { tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.BASKET] },
    async ({ pages }) => {
      await pages.homePage.open();
      await pages.loginPage.open();
      await pages.loginPage.login(newUser.email, newUser.password);
      await pages.homePage.expectLoaded();

      await pages.homePage.addProductToBasket(productName);

      await pages.homePage.navbar.openBasket();
      await pages.basketPage.expectLoaded();
      await pages.basketPage.expectProductInBasket(productName);

      await pages.basketPage.removeProduct(productName);
      await pages.basketPage.expectBasketIsEmpty();
    },
  );
});
