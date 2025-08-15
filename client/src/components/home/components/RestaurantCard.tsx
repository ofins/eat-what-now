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
  isExpanded,
  isLoggedIn,
  onExpand,
  onCollapse,
  userData,
  clickedStats,
  onUpvote,
  onFavorite,
  onComment,
  isCommenting,
  setIsCommenting,
  commentSubmitting,
  newComment,
  setNewComment,
  onCommentSubmit,
  location,
}) => {
  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
      <div
        className={`h-full flex ${
          isExpanded ? "flex-col overflow-y-auto" : "flex-col lg:flex-row"
        }`}
      >
        {/* Header with back button (only shown when expanded) */}
        {isExpanded && (
          <div className="flex-shrink-0 p-4 border-b border-gray-100">
            <button
              onClick={onCollapse}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <span className="text-lg">←</span>
              <span>Back</span>
            </button>
          </div>
        )}

        {/* Main Content Section */}
        <div
          className={`flex-1 flex flex-col p-4 min-h-0 ${
            isExpanded ? "pb-6" : "lg:p-6"
          }`}
        >
          {/* Restaurant Info */}
          <RestaurantInfo
            restaurant={restaurant}
            isExpanded={isExpanded}
            location={location}
          />

          {/* Stats Section */}
          <RestaurantStats
            restaurant={restaurant}
            isExpanded={isExpanded}
            isLoggedIn={isLoggedIn}
            clickedStats={clickedStats}
            onUpvote={onUpvote}
            onFavorite={onFavorite}
            onComment={onComment}
            onExpand={onExpand}
          />

          {/* Preview Comments (non-expanded view, mobile only) */}
          {!isExpanded && (
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
          )}

          {/* Full Comments Section (expanded view) */}
          {isExpanded && (
            <CommentSection
              restaurant={restaurant}
              isExpanded={true}
              isLoggedIn={isLoggedIn}
              userData={userData}
              isCommenting={isCommenting}
              commentSubmitting={commentSubmitting}
              newComment={newComment}
              setNewComment={setNewComment}
              setIsCommenting={setIsCommenting}
              onCommentSubmit={onCommentSubmit}
            />
          )}

          {/* Contributed by section for desktop - at bottom */}
          {!isExpanded && restaurant?.contributor_username && (
            <div className="hidden lg:block mt-auto">
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {restaurant.contributor_username
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-xs">
                      Contributed by
                    </span>
                    <span className="font-medium text-gray-800 text-xs">
                      @{restaurant.contributor_username}
                    </span>
                  </div>
                </div>
                <div className="text-purple-500">
                  <svg
                    className="w-4 h-4"
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

        {/* Comments Sidebar (desktop only, non-expanded view) */}
        {!isExpanded && (
          <div className="hidden lg:flex lg:flex-col lg:w-80 lg:border-l lg:border-gray-100 lg:bg-gray-50">
            <div className="p-4 flex flex-col h-full">
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
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
