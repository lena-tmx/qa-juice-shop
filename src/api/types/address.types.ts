export interface CreateAddressRequest {
  fullName: string;
  mobileNum: number;
  zipCode: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
}

export interface AddressResponse {
  id: number;
  fullName: string;
  mobileNum: number;
  zipCode: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  UserId: number;
  createdAt: string;
  updatedAt: string;
}
