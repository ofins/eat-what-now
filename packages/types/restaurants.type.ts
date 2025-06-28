import type { PaginationTypes } from "./index";

export interface IRestaurant {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  price_range: number;
  rating: number;
  average_ratings: number;
  total_upvotes: number;
  total_downvotes: number;
  total_favorites: number;
  total_comments: number;
  img_url?: string;
  outbound_link?: string;
  created_at: Date;
  updated_at: Date;
}

export interface RestaurantFilterOptions extends PaginationTypes {
  longitude?: number;
  latitude?: number;
  radius?: number; // in kilometers
  cuisineType?: string;
  priceRange?: string;
  minRating?: number;
}

/**
 * Restaurant creation data
 */
export interface CreateRestaurantData {
  name: string;
  address: string;
  cuisine_type: string;
  price_range: number;
  longitude: number;
  latitude: number;
  open_hours?: string;
  contact_info?: string;
  rating?: number;
  average_ratings?: number;
}

/**
 * Restaurant update data
 */
export interface UpdateRestaurantData {
  name?: string;
  address?: string;
  cuisine_type?: string;
  price_range?: number;
  rating?: number;
  longitude?: number;
  latitude?: number;
  open_hours?: string;
  contact_info?: string;
}

/**
 * Configuration options for the RestaurantService
 */
export interface RestaurantsRepositoryConfig {
  maxSearchRadius: number; // Maximum search radius in kilometers
  defaultLimit: number;
}
