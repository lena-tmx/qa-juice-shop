import { qase } from "playwright-qase-reporter";
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe(`Basket UI`, () => {
  const productName = "Carrot Juice";

  test(
    qase(83, `Basket displays a product after it is added`),
    { tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.BASKET] },
    async ({ authenticatedPages }) => {
      await authenticatedPages.homePage.addProductToBasket(productName);

      await authenticatedPages.homePage.navbar.openBasket();
      await authenticatedPages.basketPage.expectLoaded();
      await authenticatedPages.basketPage.expectProductInBasket(productName);
    },
  );

  test(
    qase(84, `Basket is empty after its only product is removed`),
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
