import { qase } from "playwright-qase-reporter";
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe(`Basket UI`, () => {
  const productName = "Carrot Juice";

  test(
    qase(83, `should add product to basket and see it there`),
    { tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.BASKET] },
    async ({ authenticatedPages }) => {
      await authenticatedPages.homePage.addProductToBasket(productName);

      await authenticatedPages.homePage.navbar.openBasket();
      await authenticatedPages.basketPage.expectLoaded();
      await authenticatedPages.basketPage.expectProductInBasket(productName);
    },
  );

  test(
    qase(84, `should add and remove product to basket and see it empty`),
    { tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.BASKET] },
    async ({ authenticatedPages }) => {
      await authenticatedPages.homePage.addProductToBasket(productName);

      await authenticatedPages.homePage.navbar.openBasket();
      await authenticatedPages.basketPage.expectLoaded();
      await authenticatedPages.basketPage.expectProductInBasket(productName);

      await authenticatedPages.basketPage.removeProduct(productName);
      await authenticatedPages.basketPage.expectBasketIsEmpty();
    },
  );
});
