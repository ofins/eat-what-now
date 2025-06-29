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
    `${import.meta.env.VITE_API_BASE_URL}/restaurants/user`,
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
