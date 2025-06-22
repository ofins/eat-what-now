export const updateRestaurantVote = async ({
  user_id,
  restaurant_id,
  upvoted,
}: {
  user_id: string;
  restaurant_id: number;
  upvoted: boolean;
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/restaurants/user`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, restaurant_id, upvoted }),
    }
  );

  if (!response.ok) throw new Error("Failed to update restaurant vote");

  return response.json();
};
