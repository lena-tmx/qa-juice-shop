import { z } from "zod";

export const productSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1),
    price: z.number().nonnegative(),
  })
  .passthrough();

export const productListResponseSchema = z
  .object({ data: z.array(productSchema) })
  .passthrough();

export const productResponseSchema = z
  .object({ data: productSchema })
  .passthrough();

export const basketItemSchema = z
  .object({
    id: z.number().int().positive(),
    ProductId: z.number().int().positive(),
    BasketId: z.number().int().positive(),
    quantity: z.number().int().nonnegative(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .passthrough();

export const basketItemResponseSchema = z
  .object({ data: basketItemSchema })
  .passthrough();

export const basketItemsResponseSchema = z
  .object({ data: z.array(basketItemSchema) })
  .passthrough();

export const basketResponseSchema = z
  .object({
    data: z
      .object({
        id: z.number().int().positive(),
        Products: z.array(z.unknown()),
      })
      .passthrough(),
  })
  .passthrough();

export const loginResponseSchema = z
  .object({
    authentication: z
      .object({
        token: z.string().min(1),
        bid: z.number().int().positive(),
        umail: z.string().email().optional(),
      })
      .passthrough(),
    token: z.string().min(1).optional(),
  })
  .passthrough();

export const userResponseSchema = z
  .object({
    data: z.object({ email: z.string().email() }).passthrough(),
  })
  .passthrough();

export const securityQuestionsResponseSchema = z
  .object({
    data: z.array(
      z.object({ question: z.string().min(1) }).passthrough(),
    ),
  })
  .passthrough();

export const addressResponseSchema = z
  .object({
    data: z
      .object({
        fullName: z.string().min(1),
        city: z.string().min(1),
        country: z.string().min(1),
      })
      .passthrough(),
  })
  .passthrough();

export const addressListResponseSchema = z
  .object({ data: z.array(z.unknown()) })
  .passthrough();

export const cardResponseSchema = z
  .object({
    data: z
      .object({
        fullName: z.string().min(1),
        expMonth: z.number().int().min(1).max(12),
      })
      .passthrough(),
  })
  .passthrough();

export const cardListResponseSchema = z
  .object({ data: z.array(z.unknown()) })
  .passthrough();

export const feedbackResponseSchema = z
  .object({
    data: z
      .object({
        comment: z.string(),
        rating: z.number().int().min(1).max(5),
      })
      .passthrough(),
  })
  .passthrough();

export const orderHistoryResponseSchema = z
  .object({ data: z.array(z.unknown()) })
  .passthrough();

export const captchaSchema = z
  .object({
    captchaId: z.number().int().nonnegative(),
    captcha: z.string().min(1),
    answer: z.string().min(1),
  })
  .passthrough();
