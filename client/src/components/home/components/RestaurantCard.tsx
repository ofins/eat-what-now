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
        className={`h-full flex flex-col ${isExpanded ? "overflow-y-auto" : ""}`}
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

        {/* Content Section - Scrollable if needed */}
        <div
          className={`flex-1 flex flex-col p-4 min-h-0 ${isExpanded ? "pb-6" : ""}`}
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

          {/* Preview Comments (non-expanded view) */}
          {!isExpanded && (
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
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
