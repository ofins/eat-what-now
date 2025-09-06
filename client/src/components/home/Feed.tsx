import { useCallback, useEffect, useState } from "react";
import {
  toggleFavorite,
  toggleUpvote,
  updateRating,
} from "../../api/restaurants-user";
import { useLocation } from "../../hooks/useLocation";
import CommentsModal from "./components/CommentsModal";
import ErrorSVG from "./components/ErrorSVG";
import RestaurantCard from "./components/RestaurantCard";
import SpinnerSVG from "./components/SpinnerSVG";
import { useFeedData } from "./hooks/useFeedData";
import { useRestaurantInteractions } from "./hooks/useRestaurantInteractions";

interface Props {
  isLoggedIn?: boolean;
}

const Feed = ({ isLoggedIn = false }: Props) => {
  const {
    location,
    loading: locationLoading,
    error: locationError,
    refreshLocation,
  } = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNextButtonPressed, setIsNextButtonPressed] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  console.log({ location, locationLoading, locationError });
  const {
    restaurants,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFeedData(
    location?.latitude && location?.longitude
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
        }
      : null
  );

  const currentRestaurant = restaurants[currentIndex] || null;

  const {
    userData,
    clickedStats,
    newComment,
    setNewComment,
    isCommenting,
    setIsCommenting,
    commentSubmitting,
    handleCommentSubmit,
  } = useRestaurantInteractions(isLoggedIn, currentRestaurant, refetch);

  const handleNext = useCallback(() => {
    // Reset comment state when going to next restaurant
    setIsCommenting(false);
    setNewComment("");
    setIsCommentsModalOpen(false);

    // Add button press animation
    setIsNextButtonPressed(true);
    setTimeout(() => {
      setIsNextButtonPressed(false);
    }, 200);

    // Calculate next index
    let calculatedNextIndex;
    if (currentIndex < restaurants.length - 1) {
      calculatedNextIndex = currentIndex + 1;
    } else if (hasNextPage) {
      // If we're at the end but there are more pages, we'll handle this after fetch
      calculatedNextIndex = currentIndex + 1;
    } else {
      // If we're at the very end, reset to beginning
      calculatedNextIndex = 0;
    }

    // Complete the transition
    setTimeout(() => {
      if (currentIndex >= restaurants.length - 1 && hasNextPage) {
        // Fetch next page if needed
        fetchNextPage().then(() => {
          setCurrentIndex(calculatedNextIndex);
        });
      } else {
        setCurrentIndex(calculatedNextIndex);
      }
    }, 200);
  }, [
    currentIndex,
    restaurants.length,
    hasNextPage,
    fetchNextPage,
    setIsCommenting,
    setNewComment,
  ]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  const handleCommentClick = () => {
    if (isLoggedIn) {
      setIsCommentsModalOpen(true);
      setTimeout(() => {
        setIsCommenting(true);
      }, 300);
    }
  };

  const handleStatClick = async (
    statType: string,
    action: () => Promise<void>
  ) => {
    if (!isLoggedIn || !userData?.data.id) return;

    // Show pulse animation
    const key = `${currentRestaurant?.id}-${statType}`;
    clickedStats[key] = true;

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
      clickedStats[key] = false;
    }, 300);
  };

  const handleRating = async (rating: number) => {
    if (!isLoggedIn || !userData?.data.id || !currentRestaurant) return;

    try {
      await updateRating(userData.data.id, currentRestaurant.id, rating);

      // Refetch feed data to update rating
      await refetch();
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  // Prefetch next page when user is near the end
  if (
    currentIndex >= restaurants.length - 3 &&
    hasNextPage &&
    !isFetchingNextPage
  ) {
    fetchNextPage();
  }

  // Location loading and error states
  if (locationLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-xs">
        <div className="mb-4">
          <SpinnerSVG />
        </div>
        <p>Getting your location...</p>
        <p className="text-gray-500 mt-2">
          This helps us show restaurants near you
        </p>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-xs">
        <div className="mb-4 text-red-500">
          <ErrorSVG />
        </div>
        <p className="text-red-500 mb-2">{locationError}</p>
        <button
          onClick={refreshLocation}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
        <p className="text-gray-500 mt-2 text-center">
          You can also manually enable location access in your browser settings
        </p>
      </div>
    );
  }

  // Loading and error states
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen text-xs">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xs">
        Error: {error.message}
      </div>
    );

  if (restaurants.length === 0)
    return (
      <div className="flex items-center justify-center h-screen text-xs">
        No restaurants found
      </div>
    );

  return (
    <div
      id="Feed"
      className="flex flex-col items-center h-screen min-h-[400px] px-2"
    >
      {/* Card Stack Container */}
      <div className="relative transition-all duration-500 ease-in-out mt-6 w-80 h-[70%] max-w-sm lg:w-[80%] lg:max-w-[1000px] lg:h-[calc(80vw*9/16)] lg:max-h-[562px]">
        {/* Desktop Next Button - Right side */}
        <button
          onClick={handleNext}
          className={`hidden lg:block absolute -right-16 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-10 cursor-pointer ${
            isNextButtonPressed ? "scale-90 bg-blue-700" : ""
          }`}
          title="Next Restaurant (Right Arrow)"
        >
          <svg
            className="w-6 h-6 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Current card */}
        <div className={`absolute inset-0`} style={{ zIndex: 3 }}>
          {currentRestaurant && (
            <RestaurantCard
              restaurant={currentRestaurant}
              isExpanded={false}
              isLoggedIn={isLoggedIn}
              onExpand={() => {}} // No longer used, but kept for interface compatibility
              onCollapse={() => {}} // No longer used, but kept for interface compatibility
              userData={userData}
              clickedStats={clickedStats}
              onUpvote={() =>
                handleStatClick("upvote", async () => {
                  await toggleUpvote(
                    userData?.data.id || "",
                    currentRestaurant.id,
                    !currentRestaurant.user_upvoted
                  );
                })
              }
              onFavorite={() =>
                handleStatClick("favorite", async () => {
                  await toggleFavorite(
                    userData?.data.id || "",
                    currentRestaurant.id,
                    !currentRestaurant.user_favorited
                  );
                })
              }
              onComment={handleCommentClick}
              onRating={handleRating}
              isCommenting={isCommenting}
              setIsCommenting={setIsCommenting}
              commentSubmitting={commentSubmitting}
              newComment={newComment}
              setNewComment={setNewComment}
              onCommentSubmit={handleCommentSubmit}
              location={
                location?.latitude && location?.longitude
                  ? {
                      latitude: location.latitude as number,
                      longitude: location.longitude as number,
                    }
                  : null
              }
            />
          )}
        </div>
      </div>

      {/* Mobile Next Button */}
      <div className="mt-6 lg:hidden">
        <button
          onClick={handleNext}
          className={`px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium shadow-md transition-all duration-200 cursor-pointer text-xs ${
            isNextButtonPressed ? "scale-95 bg-blue-700" : ""
          }`}
        >
          Next Restaurant
        </button>
      </div>

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="mt-4 text-xs text-blue-500 font-medium">
          Loading more restaurants...
        </div>
      )}

      {/* Comments Modal */}
      {currentRestaurant && (
        <CommentsModal
          isOpen={isCommentsModalOpen}
          onClose={() => {
            setIsCommentsModalOpen(false);
            setIsCommenting(false);
            setNewComment("");
          }}
          restaurant={currentRestaurant}
          isLoggedIn={isLoggedIn}
          userData={userData}
          isCommenting={isCommenting}
          commentSubmitting={commentSubmitting}
          newComment={newComment}
          setNewComment={setNewComment}
          setIsCommenting={setIsCommenting}
          onCommentSubmit={handleCommentSubmit}
        />
      )}
    </div>
  );
};

export default Feed;
