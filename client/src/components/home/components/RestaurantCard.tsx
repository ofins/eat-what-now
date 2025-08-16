import type { IRestaurant } from "@ewn/types/restaurants.type";
import type { IUser } from "@ewn/types/users.type";
import React from "react";
import CommentSection from "./CommentSection";
import RestaurantInfo from "./RestaurantInfo";
import RestaurantStats from "./RestaurantStats";

interface RestaurantCardProps {
  restaurant: IRestaurant;
  isExpanded: boolean;
  isLoggedIn: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  userData?: { data: IUser };
  clickedStats: { [key: string]: boolean };
  onUpvote: () => void;
  onFavorite: () => void;
  onComment: () => void;
  onRating: (rating: number) => void;
  isCommenting: boolean;
  setIsCommenting: (value: boolean) => void;
  commentSubmitting: boolean;
  newComment: string;
  setNewComment: (comment: string) => void;
  onCommentSubmit: (e: React.FormEvent) => Promise<void>;
  location: { latitude: number; longitude: number } | null;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  isLoggedIn,
  // isExpanded,
  onExpand,
  // onCollapse,
  userData,
  clickedStats,
  onUpvote,
  onFavorite,
  onComment,
  onRating,
  isCommenting,
  setIsCommenting,
  commentSubmitting,
  newComment,
  setNewComment,
  onCommentSubmit,
  location,
}) => {
  return (
    <div
      className="w-full h-full bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden"
      style={{ transition: "none", animation: "none" }}
    >
      <div
        className="h-full flex flex-col lg:flex-row"
        style={{ transition: "none", animation: "none" }}
      >
        {/* Main Content Section */}
        <div className="flex-1 flex flex-col p-3 min-h-0 lg:p-4">
          {/* Restaurant Info */}
          <RestaurantInfo
            restaurant={restaurant}
            isExpanded={false}
            location={location}
            isLoggedIn={isLoggedIn}
            onRating={onRating}
          />

          {/* Stats Section */}
          <RestaurantStats
            restaurant={restaurant}
            isExpanded={false}
            isLoggedIn={isLoggedIn}
            clickedStats={clickedStats}
            onUpvote={onUpvote}
            onFavorite={onFavorite}
            onComment={onComment}
            onExpand={onExpand}
          />

          {/* Preview Comments (mobile only) */}
          <div className="lg:hidden">
            <CommentSection
              restaurant={restaurant}
              isExpanded={false}
              isLoggedIn={isLoggedIn}
              userData={userData}
              isCommenting={isCommenting}
              commentSubmitting={commentSubmitting}
              newComment={newComment}
              setNewComment={setNewComment}
              setIsCommenting={setIsCommenting}
              onCommentSubmit={onCommentSubmit}
              showPreview={true}
            />
          </div>

          {/* Mobile Contributed by section - moved to bottom */}
          {restaurant?.contributor_username && (
            <div className="lg:hidden mt-auto">
              <div className="flex items-center gap-1.5 p-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {restaurant.contributor_username
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-gray-600 text-xs whitespace-nowrap">
                      by
                    </span>
                    <span className="font-medium text-gray-800 text-xs truncate">
                      @{restaurant.contributor_username}
                    </span>
                  </div>
                </div>
                <div className="text-purple-500 flex-shrink-0">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Contributed by section for desktop - at bottom */}
          {restaurant?.contributor_username && (
            <div className="hidden lg:block mt-auto">
              <div className="flex items-center gap-1.5 p-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {restaurant.contributor_username
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-gray-600 text-xs whitespace-nowrap">
                      by
                    </span>
                    <span className="font-medium text-gray-800 text-xs truncate">
                      @{restaurant.contributor_username}
                    </span>
                  </div>
                </div>
                <div className="text-purple-500 flex-shrink-0">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Comments Sidebar (desktop only) */}
        <div className="hidden lg:flex lg:flex-col lg:w-80 lg:border-l lg:border-gray-100 lg:bg-gray-50">
          <div className="p-3 flex flex-col h-full">
            <CommentSection
              restaurant={restaurant}
              isExpanded={false}
              isLoggedIn={isLoggedIn}
              userData={userData}
              isCommenting={isCommenting}
              commentSubmitting={commentSubmitting}
              newComment={newComment}
              setNewComment={setNewComment}
              setIsCommenting={setIsCommenting}
              onCommentSubmit={onCommentSubmit}
              showPreview={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
