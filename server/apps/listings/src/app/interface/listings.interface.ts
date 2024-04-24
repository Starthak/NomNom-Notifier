import { LimitedUserData } from "../types/listings.types";

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  condition: string;
  price: number;
  city: string;
  state?: string;
  imageUrls: string[];
  userId: string;
  postedAt: Date;
  rating?: number;
  discount?: number;
  delivery: string;
  quantity: number;
}
export interface Category {
  label: string;
  description: string;
  icon: string;
}

export interface GetPremiumUsersResponse {
  data: {
    getPremiumUsers: LimitedUserData[];
  };
}
export interface GetBasicUsersResponse {
  data: {
    getSeller: LimitedUserData[];
  };
}

export interface GetFavIdsResponse {
  data: {
    getFavoriteIds: string[];
  };
}