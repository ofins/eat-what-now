import { useCallback, useEffect, useState } from "react";
import { toggleFavorite, toggleUpvote } from "../../api/restaurants-user";
import { useLocation } from "../../hooks/useLocation";
import RestaurantCard from "./components/RestaurantCard";
import { useFeedData } from "./hooks/useFeedData";
import { useRestaurantInteractions } from "./hooks/useRestaurantInteractions";

interface Props {
  isLoggedIn?: boolean;
}

const Feed = ({ isLoggedIn = false }: Props) => {
  const { location } = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNextButtonPressed, setIsNextButtonPressed] = useState(false);

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
    // Reset expanded state when going to next restaurant
    setIsExpanded(false);
    setIsCommenting(false);
    setNewComment("");

    // Add button press animation
    setIsNextButtonPressed(true);
    setTimeout(() => {
      setIsNextButtonPressed(false);
    }, 200);

    // Add fade transition
    setIsTransitioning(true);

    setTimeout(() => {
      console.log({ currentIndex });
      console.log({ restaurants });
      console.log({ hasNextPage });

      if (currentIndex < restaurants.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (hasNextPage) {
        // If we're at the end but there are more pages, fetch and reset
        fetchNextPage().then(() => {
          setCurrentIndex((prev) => prev + 1);
        });
      } else {
        // If we're at the very end, reset to beginning
        setCurrentIndex(0);
      }

      // Remove transition after card changes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 150);
  }, [
    currentIndex,
    restaurants,
    hasNextPage,
    fetchNextPage,
    setIsCommenting,
    setNewComment,
  ]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && !isExpanded) {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded, handleNext]);

  const handleExpand = () => setIsExpanded(true);
  const handleCollapse = () => setIsExpanded(false);

  const handleCommentClick = () => {
    if (isLoggedIn) {
      setIsExpanded(true);
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

  // Prefetch next page when user is near the end
  if (
    currentIndex >= restaurants.length - 3 &&
    hasNextPage &&
    !isFetchingNextPage
  ) {
    fetchNextPage();
  }

  // Loading and error states
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error.message}
      </div>
    );

  if (restaurants.length === 0)
    return (
      <div className="flex items-center justify-center h-screen">
        No restaurants found
      </div>
    );

  return (
    <div
      id="Feed"
      className="flex flex-col items-center h-screen min-h-[400px] px-4"
    >
      {/* Card Stack Container */}
      <div
        className={`relative transition-all duration-500 ease-in-out mt-6 ${
          isExpanded
            ? "w-[95vw] h-[83vh] max-w-[500px]"
            : "w-80 h-[70%] max-w-sm lg:w-[80%] lg:max-w-[1000px] lg:h-[calc(80vw*9/16)] lg:max-h-[562px]"
        }`}
      >
        {/* Desktop Next Button - Right side */}
        {!isExpanded && (
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
        )}

        {/* Current card */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
          style={{ zIndex: 3 }}
        >
          {currentRestaurant && (
            <RestaurantCard
              restaurant={currentRestaurant}
              isExpanded={isExpanded}
              isLoggedIn={isLoggedIn}
              onExpand={handleExpand}
              onCollapse={handleCollapse}
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
      {!isExpanded && (
        <div className="mt-6 lg:hidden">
          <button
            onClick={handleNext}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium shadow-md transition-all duration-200 cursor-pointer ${
              isNextButtonPressed ? "scale-95 bg-blue-700" : ""
            }`}
          >
            Next Restaurant
          </button>
        </div>
      )}

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="mt-4 text-sm text-blue-500 font-medium">
          Loading more restaurants...
        </div>
      )}
    </div>
  );
};

export default Feed;
