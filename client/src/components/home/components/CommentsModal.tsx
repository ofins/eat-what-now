import type { Comment, IRestaurant } from "@ewn/types/restaurants.type";
import type { IUser } from "@ewn/types/users.type";
import React, { useEffect, useRef, useState } from "react";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: IRestaurant;
  isLoggedIn: boolean;
  userData?: { data: IUser };
  isCommenting: boolean;
  commentSubmitting: boolean;
  newComment: string;
  setNewComment: (comment: string) => void;
  setIsCommenting: (value: boolean) => void;
  onCommentSubmit: (e: React.FormEvent) => Promise<void>;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  isLoggedIn,
  userData,
  isCommenting,
  commentSubmitting,
  newComment,
  setNewComment,
  setIsCommenting,
  onCommentSubmit,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editingUserComment, setEditingUserComment] = useState(false);

  // Auto-focus textarea when commenting starts
  useEffect(() => {
    if (isCommenting && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCommenting]);

  if (!isOpen) return null;

  // Helper function to render a single comment
  const renderComment = (
    commentItem: Comment,
    index: number,
    isUserComment = false
  ) => {
    return (
      <div
        key={`comment-${index}`}
        className={`bg-white rounded-lg p-2 shadow-sm ${
          isUserComment
            ? "border-l-4 border-blue-500"
            : "border border-gray-100"
        }`}
      >
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {commentItem.username?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-800 truncate">
                @{commentItem.username}
              </span>
              {isUserComment && !editingUserComment && (
                <button
                  className="text-gray-400 hover:text-blue-500 text-xs"
                  onClick={() => {
                    if (typeof restaurant.user_comment === "string") {
                      setNewComment(restaurant.user_comment);
                    }
                    setIsCommenting(true);
                    setEditingUserComment(true);
                  }}
                >
                  Edit
                </button>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {isUserComment ? restaurant.user_comment : commentItem.comment}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(commentItem.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    try {
      await onCommentSubmit(e);
      setEditingUserComment(false);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Comments</h3>
            <p className="text-xs text-gray-500 mt-1">{restaurant.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* User's comment */}
          {restaurant?.user_comment && (
            <div>
              {renderComment(
                {
                  username: userData?.data.username || "You",
                  comment: restaurant.user_comment as string,
                  updatedAt: new Date().toISOString(),
                },
                -1,
                true
              )}
            </div>
          )}

          {/* Other comments */}
          {restaurant?.comments && restaurant.comments.length > 0 ? (
            restaurant.comments.map((commentItem, index) =>
              renderComment(commentItem, index)
            )
          ) : !restaurant?.user_comment ? (
            <div className="text-center py-8">
              <p className="text-xs text-gray-500">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : null}
        </div>

        {/* Comment Form */}
        {isLoggedIn && (
          <div className="border-t border-gray-200 p-4">
            {isCommenting ? (
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <textarea
                  ref={textareaRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={
                    editingUserComment
                      ? "Edit your comment..."
                      : "Share your experience..."
                  }
                  className="w-full p-2 text-xs border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  disabled={commentSubmitting}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCommenting(false);
                      setEditingUserComment(false);
                      setNewComment("");
                    }}
                    className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={commentSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || commentSubmitting}
                    className="px-3 py-1.5 text-xs text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {commentSubmitting
                      ? "Submitting..."
                      : editingUserComment
                        ? "Update"
                        : "Comment"}
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsCommenting(true)}
                className="w-full p-2 text-xs text-left text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Add a comment...
              </button>
            )}
          </div>
        )}

        {!isLoggedIn && (
          <div className="border-t border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500">
              Please log in to add comments
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsModal;
