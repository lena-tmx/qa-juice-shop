export interface CreateFeedbackRequest {
  comment: string;
  rating: number;
  captchaId: number;
  captcha: string;
}

export interface FeedbackResponse {
  id: number;
  comment: string;
  rating: number;
  UserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CaptchaResponse {
  captchaId: number;
  captcha: string;
  answer: string;
}
