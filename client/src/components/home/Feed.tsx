import { useState } from "react";
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

  const handleNext = () => {
    // Reset expanded state when going to next restaurant
    setIsExpanded(false);
    setIsCommenting(false);
    setNewComment("");

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
  };

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
            : "w-80 h-[70%] max-w-sm"
        }`}
      >
        {/* Current card */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
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

      {/* Next Button */}
      {!isExpanded && (
        <div className="mt-6">
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium shadow-md transition-colors cursor-pointer"
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
