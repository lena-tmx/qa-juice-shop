export interface CreateCardRequest {
  fullName: string;
  cardNum: number;
  expMonth: number;
  expYear: number;
}

export interface CardResponse {
  id: number;
  fullName: string;
  cardNum: number;
  expMonth: number;
  expYear: number;
  UserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CardApiResponse {
  data: CardResponse;
}

export interface CardListResponse {
  data: CardResponse[];
}
