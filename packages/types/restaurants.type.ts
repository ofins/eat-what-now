import type { PaginationTypes } from "./index";

export interface IRestaurant {
  id: number;
  google_id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  price_range: number;
  rating: number;
  total_upvotes: number;
  total_favorites: number;
  total_comments: number;
  img_url?: string;
  outbound_link?: string;
  created_at: Date;
  updated_at: Date;
  contributor_username?: string; // Username of the contributor who added the restaurant
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
  google_id: string;
  name: string;
  address: string;
  price_range: number;
  longitude: number;
  latitude: number;
  website?: string;
  outbound_link?: string;
  img_url?: string;
  contributor_username?: string;
}

export interface CreateRestaurantDto {
  name: string;
  address: string;
  price_range: number;
  longitude: number;
  latitude: number;
  website?: string;
  outbound_link?: string;
  img_url?: string;
  contributor_username?: string;
  google_id?: string;
}

export interface CreateRestaurant {
  name: string;
  address: string;
  price_range: number;
  longitude: number;
  latitude: number;
  website?: string;
  outbound_link?: string;
  img_url?: string;
  contributor_username?: string;
  google_id?: string;
  rating?: number;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateRestaurantDto {
  name?: string;
  address?: string;
  price_range?: number;
  longitude?: number;
  latitude?: number;
  website?: string;
  outbound_link?: string;
  img_url?: string;
  contributor_username?: string;
  google_id?: string;
  rating?: number;
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

export interface PlacesAPIResponse {
  places: RestaurantGoogleDetails[];
  routingSummaries: RoutingSummary[];
}

export interface RoutingSummary {
  legs: Array<{
    duration: string;
    distanceMeters: number;
  }>;
  directionsUri: string;
}

export interface RestaurantGoogleDetails {
  id: string;
  formattedAddress: string;
  priceLevel: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  photos: Photo[];
  location: {
    latitude: number;
    longitude: number;
  };
  websiteUri: string;
  googleMapsUri: string;
}

export interface Photo {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: Array<{
    displayName: string;
    uri: string;
    photoUri: string;
  }>;
  flagContentUri: string;
  googleMapsUri: string;
}
