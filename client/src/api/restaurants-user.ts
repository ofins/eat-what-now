import { httpClient } from "./http-client";

export const updateRestaurantUserRelation = async ({
  user_id,
  restaurant_id,
  upvoted,
  downvoted,
  favorited,
  rating,
  comment,
  visited_at,
}: {
  user_id: string;
  restaurant_id: number;
  upvoted?: boolean;
  downvoted?: boolean;
  favorited?: boolean;
  rating?: number;
  comment?: string;
  visited_at?: Date;
}) => {
  const response = await httpClient.post(
    `${import.meta.env.VITE_API_BASE_URL}/restaurant-user`,
    {
      user_id,
      restaurant_id,
      upvoted,
      downvoted,
      favorited,
      rating,
      comment,
      visited_at,
    }
  );

  if (!response) throw new Error("Failed to update restaurant user relation");

  return response;
};

export const toggleUpvote = async (
  user_id: string,
  restaurant_id: number,
  upvote: boolean
) => {
  const response = await httpClient.post(
    `${import.meta.env.VITE_API_BASE_URL}/restaurant-user/upvote`,
    {
      userId: user_id,
      restaurantId: restaurant_id,
      upvoted: upvote,
    }
  );

  if (!response) throw new Error("Failed to toggle upvote");

  return response;
};

export const toggleFavorite = async (
  user_id: string,
  restaurant_id: number,
  favorite: boolean
) => {
  const response = await httpClient.post(
    `${import.meta.env.VITE_API_BASE_URL}/restaurant-user/favorite`,
    {
      userId: user_id,
      restaurantId: restaurant_id,
      favorited: favorite,
    }
  );

  if (!response) throw new Error("Failed to toggle favorite");

  return response;
};
