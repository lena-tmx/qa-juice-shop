import { qase } from "playwright-qase-reporter";
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe(`Basket UI`, () => {
  const productName = "Carrot Juice";

  test(
    qase(83, `Basket displays a product after it is added`),
    { tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.BASKET] },
    async ({ authenticatedUi }) => {
      const { pages } = authenticatedUi;
      await pages.homePage.addProductToBasket(productName);

      await pages.homePage.navbar.openBasket();
      await pages.basketPage.expectLoaded();
      await pages.basketPage.expectProductInBasket(productName);
    },
  );

  test(
    qase(84, `Basket is empty after its only product is removed`),
    { tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.BASKET] },
    async ({ authenticatedUi }) => {
      const { pages } = authenticatedUi;
      await pages.homePage.addProductToBasket(productName);

      await pages.homePage.navbar.openBasket();
      await pages.basketPage.expectLoaded();
      await pages.basketPage.expectProductInBasket(productName);

      await pages.basketPage.removeProduct(productName);
      await pages.basketPage.expectBasketIsEmpty();
    },
  );
});
