import { expect } from "@playwright/test";
import type { BasketItemResponse } from "@src/api/types/basket.types";
import type { Product } from "@src/api/types/products.types";
import { step } from "@src/utils/step";

export class DomainAssertions {
  @step(
    (products: Product[], query: string) =>
      `Verify product results contain: ${query}`,
  )
  async expectProductsContain(
    products: Product[],
    query: string,
  ): Promise<void> {
    const normalizedQuery = query.toLowerCase();
    expect(
      products.some((product) =>
        product.name.toLowerCase().includes(normalizedQuery),
      ),
      `Expected at least one product name to contain "${query}"`,
    ).toBe(true);
  }

  @step(
    (items: BasketItemResponse[], itemId: number) =>
      `Verify basket item is absent (id: ${itemId})`,
  )
  async expectBasketItemAbsent(
    items: BasketItemResponse[],
    itemId: number,
  ): Promise<void> {
    expect(items.map((item) => item.id)).not.toContain(itemId);
  }
}
