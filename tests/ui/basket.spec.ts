import { qase } from "playwright-qase-reporter";
import { ProductNames } from "@src/data/products";
import { test } from "../fixtures";
import { Tags } from "../attributes/tags";

test.describe(`Basket UI`, () => {
  test(
    qase(83, `Basket displays a product after it is added`),
    { tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.BASKET] },
    async ({ authenticatedUi }) => {
      const { ui } = authenticatedUi;
      await ui.homePage.addProductToBasket(ProductNames.CARROT_JUICE);

      await ui.homePage.navbar.openBasket();
      await ui.basketPage.expectLoaded();
      await ui.basketPage.expectProductInBasket(ProductNames.CARROT_JUICE);
    },
  );

  test(
    qase(84, `Basket is empty after its only product is removed`),
    { tag: [Tags.TEST_TYPE.UI, Tags.FEATURE.BASKET] },
    async ({ authenticatedUi }) => {
      const { ui } = authenticatedUi;
      await ui.homePage.addProductToBasket(ProductNames.CARROT_JUICE);

      await ui.homePage.navbar.openBasket();
      await ui.basketPage.expectLoaded();
      await ui.basketPage.expectProductInBasket(ProductNames.CARROT_JUICE);

      await ui.basketPage.removeProduct(ProductNames.CARROT_JUICE);
      await ui.basketPage.expectBasketIsEmpty();
    },
  );
});
