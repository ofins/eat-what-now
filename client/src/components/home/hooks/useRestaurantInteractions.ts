import type { IRestaurant } from "@ewn/types/restaurants.type";
import type { IUser } from "@ewn/types/users.type";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { useState } from "react";
import {
  toggleFavorite,
  toggleUpvote,
  updateComment,
} from "../../../api/restaurants-user";

/**
 *
 * @param isLoggedIn
 * @param currentRestaurant
 * @param refetch
 * @returns
 *
 * upvotes, comments, favorites
 */
export function useRestaurantInteractions(
  isLoggedIn: boolean,
  currentRestaurant: IRestaurant | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: () => Promise<any>
) {
  const [clickedStats, setClickedStats] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const { data: userData } = useQuery<{ data: IUser }>({
    queryKey: ["users/profile"],
    enabled: isLoggedIn,
  });

  const handleStatClick = async (
    statType: string,
    action: () => Promise<void>
  ) => {
    if (!isLoggedIn || !userData?.data.id || !currentRestaurant) return;

    // Show pulse animation
    const key = `${currentRestaurant.id}-${statType}`;
    setClickedStats((prev) => ({ ...prev, [key]: true }));

    try {
      // Execute the action and wait for it to complete
      await action();

      // Refetch feed data to update stats
      await refetch();
    } catch (error) {
      console.error(`Error performing ${statType}:`, error);
    }

    // Remove animation after delay
    setTimeout(() => {
      setClickedStats((prev) => ({ ...prev, [key]: false }));
    }, 300);
  };

  const handleToggleUpvote = async () => {
    if (!currentRestaurant || !userData?.data.id) return;

    return handleStatClick("upvote", async () => {
      await toggleUpvote(
        userData.data.id,
        currentRestaurant.id,
        !currentRestaurant.user_upvoted
      );
    });
  };

  const handleToggleFavorite = async () => {
    if (!currentRestaurant || !userData?.data.id) return;

    return handleStatClick("favorite", async () => {
      await toggleFavorite(
        userData.data.id,
        currentRestaurant.id,
        !currentRestaurant.user_favorited
      );
    });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !isLoggedIn ||
      !userData?.data.id ||
      !newComment.trim() ||
      !currentRestaurant
    )
      return;

    try {
      setCommentSubmitting(true);
      // Sanitize the comment to prevent XSS attacks
      const sanitizedComment = DOMPurify.sanitize(newComment.trim());

      await updateComment(
        userData.data.id,
        currentRestaurant.id,
        sanitizedComment
      );

      // Clear the comment field and exit commenting mode
      setNewComment("");
      setIsCommenting(false);

      // Refetch feed data to update comments
      await refetch();
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setCommentSubmitting(false);
    }
  };

  return {
    userData,
    clickedStats,
    newComment,
    setNewComment,
    isCommenting,
    setIsCommenting,
    commentSubmitting,
    handleToggleUpvote,
    handleToggleFavorite,
    handleCommentSubmit,
  };
}
