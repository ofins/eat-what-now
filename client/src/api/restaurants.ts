import type { CreateRestaurantData } from "@ewn/types/restaurants.type";
import type { SearchResult } from "../components/google/SearchResultList";
import { httpClient } from "./http-client";

export const searchRestaurantsByText = async (
  textQuery: string,
  location: {
    latitude: number;
    longitude: number;
  }
) => {
  const response = await httpClient.post<SearchResult>(
    `${import.meta.env.VITE_API_BASE_URL}/restaurants/google/search-by-text`,
    {
      text: textQuery,
      languageCode: "zh-TW",
      location,
    }
  );

  if (!response) throw new Error("Failed to search restaurants by text");

  return response;
};

export const createRestaurant = async (restaurant: CreateRestaurantData) => {
  const response = await httpClient.post(
    `${import.meta.env.VITE_API_BASE_URL}/restaurants`,
    {
      ...restaurant,
    }
  );

  if (!response) throw new Error("Failed to create restaurant");

  return response;
};
