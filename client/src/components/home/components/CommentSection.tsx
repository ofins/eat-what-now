import type { Comment, IRestaurant } from "@ewn/types/restaurants.type";
import type { IUser } from "@ewn/types/users.type";
import React, { useEffect, useRef } from "react";

interface CommentSectionProps {
  restaurant: IRestaurant;
  isExpanded: boolean;
  isLoggedIn: boolean;
  userData?: { data: IUser };
  isCommenting: boolean;
  commentSubmitting: boolean;
  newComment: string;
  setNewComment: (comment: string) => void;
  setIsCommenting: (value: boolean) => void;
  onCommentSubmit: (e: React.FormEvent) => Promise<void>;
  showPreview?: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  restaurant,
  isExpanded,
  isLoggedIn,
  userData,
  isCommenting,
  commentSubmitting,
  newComment,
  setNewComment,
  setIsCommenting,
  onCommentSubmit,
  showPreview = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea when commenting starts
  useEffect(() => {
    if (isCommenting && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCommenting]);
  // Helper function to render a single comment
  const renderComment = (
    commentItem: Comment,
    index: number,
    isUserComment = false
  ) => {
    return (
      <div
        key={`comment-${index}`}
        className={`bg-white rounded-lg p-3 shadow-sm ${isUserComment ? "border-l-4 border-blue-500 mb-4" : ""}`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
              isUserComment ? "bg-blue-500" : "bg-gray-500"
            }`}
          >
            {(isUserComment ? userData?.data.username : commentItem.username)
              ?.charAt(0)
              .toUpperCase() || (isUserComment ? "Y" : "?")}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-800">
                  {isUserComment
                    ? userData?.data.username || "You"
                    : commentItem.username}
                </span>
                {isUserComment && (
                  <span className="text-xs text-gray-500">(your comment)</span>
                )}
                {!isUserComment && commentItem.updatedAt && (
                  <span className="text-xs text-gray-500">
                    {new Date(commentItem.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              {isUserComment && (
                <button
                  className="text-gray-400 hover:text-blue-500 text-xs"
                  onClick={() => {
                    if (typeof restaurant.user_comment === "string") {
                      setNewComment(restaurant.user_comment);
                    }
                    setIsCommenting(true);
                  }}
                >
                  Edit
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {isUserComment ? restaurant.user_comment : commentItem.comment}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render a preview of comments for non-expanded view
  if (!isExpanded && showPreview) {
    const commentsToShow = [];

    // Add user comment if it exists
    if (restaurant?.user_comment) {
      commentsToShow.push(
        <div key="user-comment-preview" className="mb-2">
          {renderComment(
            {
              username: userData?.data.username || "You",
              comment: restaurant.user_comment as string,
              updatedAt: new Date().toISOString(), // We don't have the actual timestamp for user comment
            },
            -1,
            true
          )}
        </div>
      );
    }

    // Add up to 2 more comments from others
    if (restaurant?.comments && Array.isArray(restaurant.comments)) {
      const otherComments = restaurant.comments
        .filter((comment) => comment.username !== userData?.data.username)
        .slice(0, 2);

      otherComments.forEach((comment, idx) => {
        commentsToShow.push(
          <div key={`preview-comment-${idx}`} className="mb-2">
            {renderComment(comment, idx)}
          </div>
        );
      });
    }

    if (commentsToShow.length > 0) {
      return (
        <div className="flex-shrink-0 mt-2">
          <h4 className="text-xs font-medium text-gray-700 mb-2">
            Recent Comments
          </h4>
          <div className="space-y-2">{commentsToShow}</div>
        </div>
      );
    }

    return null;
  }

  // Render full comment section for expanded view OR desktop sidebar (showPreview = false)
  if (!isExpanded && showPreview) return null;

  return (
    <div className="flex-shrink-0 flex flex-col h-full">
      <div
        className={
          isExpanded
            ? "border-t border-gray-100 pt-4 flex-1 flex flex-col"
            : "flex-1 flex flex-col"
        }
      >
        <h3
          className={`font-semibold text-gray-800 mb-3 ${
            isExpanded ? "text-lg" : "text-base"
          }`}
        >
          Comments & Reviews
        </h3>

        <div className="bg-gray-50 rounded-lg p-3 space-y-3 min-h-[150px] flex-1 mb-4">
          {/* Show the current user's comment if it exists */}
          {restaurant?.user_comment &&
            renderComment(
              {
                username: userData?.data.username || "You",
                comment: restaurant.user_comment as string,
                updatedAt: new Date().toISOString(),
              },
              -1,
              true
            )}

          {/* Display all comments from the comments array */}
          {restaurant?.comments &&
          Array.isArray(restaurant.comments) &&
          restaurant.comments.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700 mt-2 mb-3">
                All Comments ({restaurant.comments.length})
              </h4>

              {restaurant.comments.map((commentItem, index) => {
                // Skip rendering if it's the current user's comment to avoid duplication
                if (commentItem.username === userData?.data.username) {
                  return null;
                }

                return renderComment(commentItem, index);
              })}
            </div>
          ) : !restaurant?.user_comment ? (
            <div className="text-center text-gray-400 text-sm py-4">
              No comments yet. Be the first to comment!
            </div>
          ) : null}
        </div>

        {/* Comment Form - Moved to bottom and only show if user doesn't have comment */}
        {isLoggedIn ? (
          !restaurant?.user_comment &&
          (isCommenting ? (
            <form
              onSubmit={onCommentSubmit}
              className="bg-white rounded-lg p-3 shadow-sm"
            >
              <div className="mb-2">
                <textarea
                  ref={textareaRef}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Share your thoughts about this restaurant..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={commentSubmitting}
                  maxLength={500}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
                  onClick={() => {
                    setIsCommenting(false);
                    setNewComment("");
                  }}
                  disabled={commentSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium transition-colors disabled:bg-blue-300"
                  disabled={!newComment.trim() || commentSubmitting}
                >
                  {commentSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <button
                className="w-full px-3 py-2 text-left text-gray-500 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
                onClick={() => setIsCommenting(true)}
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add your comment
                </span>
              </button>
            </div>
          ))
        ) : (
          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm">
            Please log in to add comments
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
