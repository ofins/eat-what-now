import { httpClient } from "./http-client";

export const updateRestaurantVote = async ({
  user_id,
  restaurant_id,
  upvoted,
}: {
  user_id: string;
  restaurant_id: number;
  upvoted: boolean;
}) => {
  const response = await httpClient.post(
    `${import.meta.env.VITE_API_BASE_URL}/restaurants/user`,
    { user_id, restaurant_id, upvoted }
  );

  if (!response) throw new Error("Failed to update restaurant vote");

  return response;
};
