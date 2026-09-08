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
  UserId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CaptchaResponse {
  captchaId: number;
  captcha: string;
  answer: string;
}

export interface FeedbackApiResponse {
  data: FeedbackResponse;
}
