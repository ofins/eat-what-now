import type { IRestaurant } from "@ewn/types/restaurants.type";
import React from "react";

interface RestaurantStatsProps {
  restaurant: IRestaurant;
  isExpanded: boolean;
  isLoggedIn: boolean;
  clickedStats: { [key: string]: boolean };
  onUpvote: () => void;
  onFavorite: () => void;
  onComment: () => void;
  onExpand?: () => void;
}

const RestaurantStats: React.FC<RestaurantStatsProps> = ({
  restaurant,
  isExpanded,
  isLoggedIn,
  clickedStats,
  onUpvote,
  onFavorite,
  onComment,
  onExpand,
}) => {
  return (
    <div className="flex-shrink-0 mb-4 pt-3 border-t border-gray-100">
      <div
        className={`grid gap-3 ${isExpanded ? "grid-cols-4" : "grid-cols-2"}`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`transition-all duration-200 hover:scale-110 active:scale-95 ${
              clickedStats[`${restaurant.id}-upvote`]
                ? "animate-pulse scale-125"
                : ""
            } ${isLoggedIn ? "cursor-pointer" : "cursor-default opacity-50"} ${
              isExpanded ? "text-base" : "text-sm"
            } ${restaurant.user_upvoted ? "text-green-600" : "text-gray-500"}`}
            onClick={onUpvote}
          >
            👍
          </span>
          <span
            className={`${isExpanded ? "text-sm" : "text-xs"} ${
              restaurant.user_upvoted
                ? "text-green-600 font-medium"
                : "text-gray-600"
            }`}
          >
            {(restaurant?.total_upvotes || 0) +
              (restaurant?.user_upvoted ? 1 : 0)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`transition-all duration-200 hover:scale-110 active:scale-95 ${
              clickedStats[`${restaurant.id}-favorite`]
                ? "animate-pulse scale-125"
                : ""
            } ${isLoggedIn ? "cursor-pointer" : "cursor-default opacity-50"} ${
              isExpanded ? "text-base" : "text-sm"
            } ${restaurant.user_favorited ? "text-pink-600" : "text-gray-500"}`}
            onClick={onFavorite}
          >
            ❤️
          </span>
          <span
            className={`${isExpanded ? "text-sm" : "text-xs"} ${
              restaurant.user_favorited
                ? "text-pink-600 font-medium"
                : "text-gray-600"
            }`}
          >
            {(restaurant?.total_favorites || 0) +
              (restaurant?.user_favorited ? 1 : 0)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`transition-all duration-200 hover:scale-110 ${
              isLoggedIn ? "cursor-pointer" : "cursor-default opacity-50"
            } ${isExpanded ? "text-base" : "text-sm"} ${
              restaurant.user_comment ? "text-blue-600" : "text-gray-500"
            }`}
            onClick={onComment}
          >
            💬
          </span>
          <span
            className={`${isExpanded ? "text-sm" : "text-xs"} ${
              restaurant.user_comment
                ? "text-blue-600 font-medium"
                : "text-gray-600"
            }`}
          >
            {(restaurant?.total_comments || 0) +
              (restaurant?.user_comment ? 1 : 0)}
          </span>
        </div>
        {!isExpanded && onExpand && (
          <div className="flex items-center justify-end">
            <button
              onClick={onExpand}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
            >
              Details →
            </button>
          </div>
        )}
      </div>

      {/* Login prompt for non-authenticated users */}
      {!isLoggedIn && (
        <div
          className={`mt-2 text-gray-400 text-center ${
            isExpanded ? "text-sm" : "text-xs"
          }`}
        >
          Login to interact with restaurants
        </div>
      )}
    </div>
  );
};

export default RestaurantStats;
