import type { IRestaurant } from "@ewn/types/restaurants.type";
import type { IUser } from "@ewn/types/users.type";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  toggleUpvote,
  updateRestaurantUserRelation,
} from "../../api/restaurants-user";
import { calculateDistance } from "../../utils/common";
import type { ILocation } from "./Home";

type FeedResponse = {
  data: IRestaurant[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  };
};

const PAGE_LIMIT = 10;

interface Props {
  location: ILocation | null;
  isLoggedIn?: boolean;
}

const Feed = ({ location, isLoggedIn = false }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clickedStats, setClickedStats] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // Efficient infinite data fetching
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<FeedResponse>({
    queryKey: ["feed"],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/feed?offset=${pageParam}&limit=${PAGE_LIMIT}&longitude=${location?.longitude}&latitude=${location?.latitude}&radius=500`
      );
      if (!response.ok) throw new Error("Failed to fetch feed");
      return response.json();
    },
    getNextPageParam: (lastPage, pages) => {
      // Check if we've reached the last page based on API pagination info
      if (lastPage.meta.page >= lastPage.meta.totalPages) {
        return undefined;
      }
      // Return the next offset (current page * limit)
      return pages.length * PAGE_LIMIT;
    },
    initialPageParam: 0,
    enabled: !!location, // Only fetch if location is provided
  });

  const { data: userData } = useQuery<{ data: IUser }>({
    queryKey: ["users/profile"], // Path matches API endpoint
    enabled: isLoggedIn, // Only fetch if user is logged in
  });

  const handleStatClick = async (
    statType: string,
    action: () => Promise<void>
  ) => {
    if (!isLoggedIn || !userData?.data.id) return;

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

  const restaurants = data?.pages.flatMap((page) => page.data) || [];

  // Prefetch next page when user is near the end
  useEffect(() => {
    if (
      currentIndex >= restaurants.length - 3 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    currentIndex,
    restaurants.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  const handleNext = () => {
    // Reset expanded state when going to next restaurant
    setIsExpanded(false);

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

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
  };

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

  const currentRestaurant = restaurants[currentIndex];
  // const nextRestaurant = restaurants[currentIndex + 1];
  // const nextNextRestaurant = restaurants[currentIndex + 2];

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
        {/* Third card (background) */}
        {/* {nextNextRestaurant && (
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-md"
            style={{
              transform: "translateY(8px) scale(0.92)",
              zIndex: 1,
            }}
          >
            <div className="w-full h-full p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-400">
                {nextNextRestaurant.name}
              </h3>
            </div>
          </div>
        )} */}

        {/* Second card (middle) */}
        {/* {nextRestaurant && (
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-lg border"
            style={{
              transform: "translateY(4px) scale(0.96)",
              zIndex: 2,
            }}
          >
            <div className="w-full h-full p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-600">
                {nextRestaurant.name}
              </h3>
            </div>
          </div>
        )} */}

        {/* Current card (top) */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 3,
          }}
        >
          <div className="w-full h-full bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
            <div
              className={`h-full flex flex-col ${isExpanded ? "overflow-y-auto" : ""}`}
            >
              {/* Header with back button (only shown when expanded) */}
              {isExpanded && (
                <div className="flex-shrink-0 p-4 border-b border-gray-100">
                  <button
                    onClick={handleCollapse}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    <span className="text-lg">←</span>
                    <span>Back</span>
                  </button>
                </div>
              )}

              {/* Image Section - Responsive height */}
              <div
                className={`w-full flex-shrink-0 bg-gray-100 overflow-hidden ${
                  isExpanded ? "h-48 rounded-none" : "h-32 rounded-t-2xl"
                }`}
              >
                {currentRestaurant?.img_url ? (
                  <img
                    src={currentRestaurant.img_url}
                    alt={currentRestaurant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>

              {/* Content Section - Scrollable if needed */}
              <div
                className={`flex-1 flex flex-col p-4 min-h-0 ${isExpanded ? "pb-6" : ""}`}
              >
                {/* Restaurant Name - Fixed height */}
                <div className="flex-shrink-0 mb-3">
                  <h2
                    className={`font-bold text-gray-800 line-clamp-2 leading-tight ${
                      isExpanded ? "text-2xl" : "text-lg"
                    }`}
                  >
                    {currentRestaurant?.name}
                  </h2>
                </div>

                {/* Address - Fixed height */}
                <div className="flex-shrink-0 mb-3">
                  <p
                    className={`text-gray-600 line-clamp-2 leading-relaxed ${
                      isExpanded ? "text-sm" : "text-xs"
                    }`}
                  >
                    {currentRestaurant?.address}
                  </p>
                </div>

                {/* Rating and Distance Row */}
                <div className="flex-shrink-0 flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-yellow-500 ${isExpanded ? "text-base" : "text-sm"}`}
                    >
                      {"★".repeat(Math.floor(currentRestaurant?.rating || 0))}
                      {"☆".repeat(
                        5 - Math.floor(currentRestaurant?.rating || 0)
                      )}
                    </span>
                    <span
                      className={`text-gray-500 font-medium ml-1 ${
                        isExpanded ? "text-sm" : "text-xs"
                      }`}
                    >
                      {Number(currentRestaurant?.rating).toFixed(1)}
                    </span>
                  </div>
                  <div
                    className={`text-gray-600 bg-gray-50 px-2 py-1 rounded-full ${
                      isExpanded ? "text-sm" : "text-xs"
                    }`}
                  >
                    {calculateDistance(
                      currentRestaurant?.latitude || 0,
                      currentRestaurant?.longitude || 0,
                      location?.latitude || 0,
                      location?.longitude || 0
                    ).toFixed(1)}{" "}
                    km
                  </div>
                </div>

                {/* Price Range and Outbound Link */}
                <div className="flex-shrink-0 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-gray-500 ${isExpanded ? "text-sm" : "text-xs"}`}
                      >
                        Price:
                      </span>
                      <span
                        className={`text-green-600 font-medium ${
                          isExpanded ? "text-base" : "text-sm"
                        }`}
                      >
                        {"$".repeat(
                          Math.floor(currentRestaurant?.price_range || 1)
                        )}
                      </span>
                    </div>

                    {/* Outbound Link Button */}
                    {currentRestaurant?.outbound_link && (
                      <a
                        href={currentRestaurant.outbound_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm ${
                          isExpanded
                            ? "px-4 py-2 text-sm font-medium"
                            : "px-3 py-1.5 text-xs font-medium"
                        }`}
                      >
                        <span>Visit</span>
                        <svg
                          className={`${isExpanded ? "w-4 h-4" : "w-3 h-3"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Stats Grid - Repositioned */}
                <div className="flex-shrink-0 mb-4 pt-3 border-t border-gray-100">
                  <div
                    className={`grid gap-3 ${isExpanded ? "grid-cols-4" : "grid-cols-2"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-green-500 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 ${
                          clickedStats[`${currentRestaurant.id}-upvote`]
                            ? "animate-pulse scale-125"
                            : ""
                        } ${isLoggedIn ? "cursor-pointer" : "cursor-default opacity-50"} ${
                          isExpanded ? "text-base" : "text-sm"
                        }`}
                        onClick={() =>
                          handleStatClick("upvote", async () => {
                            await toggleUpvote(
                              userData?.data.id || "",
                              currentRestaurant.id
                            );
                          })
                        }
                      >
                        👍
                      </span>
                      <span
                        className={`text-gray-600 ${isExpanded ? "text-sm" : "text-xs"}`}
                      >
                        {currentRestaurant?.total_upvotes || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-pink-500 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 ${
                          clickedStats[`${currentRestaurant.id}-favorite`]
                            ? "animate-pulse scale-125"
                            : ""
                        } ${isLoggedIn ? "cursor-pointer" : "cursor-default opacity-50"} ${
                          isExpanded ? "text-base" : "text-sm"
                        }`}
                        onClick={() =>
                          handleStatClick("favorite", async () => {
                            await updateRestaurantUserRelation({
                              user_id: userData?.data.id || "",
                              restaurant_id: currentRestaurant.id,
                              favorited: true,
                            });
                          })
                        }
                      >
                        ❤️
                      </span>
                      <span
                        className={`text-gray-600 ${isExpanded ? "text-sm" : "text-xs"}`}
                      >
                        {currentRestaurant?.total_favorites || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-blue-500 ${isExpanded ? "text-base" : "text-sm"}`}
                      >
                        💬
                      </span>
                      <span
                        className={`text-gray-600 ${isExpanded ? "text-sm" : "text-xs"}`}
                      >
                        {currentRestaurant?.total_comments || 0}
                      </span>
                    </div>
                    {!isExpanded && (
                      <div className="flex items-center justify-end">
                        <button
                          onClick={handleExpand}
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

                {/* Contributed By Section */}
                {currentRestaurant?.contributor_username && (
                  <div className="flex-shrink-0 mb-4">
                    <div
                      className={`flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 ${
                        isExpanded ? "" : "mx-1"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {currentRestaurant.contributor_username
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`text-gray-600 ${isExpanded ? "text-xs" : "text-xs"}`}
                          >
                            Contributed by
                          </span>
                          <span
                            className={`font-medium text-gray-800 ${isExpanded ? "text-sm" : "text-xs"}`}
                          >
                            @{currentRestaurant.contributor_username}
                          </span>
                        </div>
                      </div>
                      <div className="text-purple-500">
                        <svg
                          className={`${isExpanded ? "w-5 h-5" : "w-4 h-4"}`}
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

                {/* Comments Section - Only visible when expanded */}
                {isExpanded && (
                  <div className="flex-shrink-0">
                    <div className="border-t border-gray-100 pt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Comments & Reviews
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-3 min-h-[200px]">
                        {/* Placeholder comments - Replace with actual comment data */}
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              U
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm text-gray-800">
                                  User Name
                                </span>
                                <span className="text-xs text-gray-500">
                                  2 days ago
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Great food and excellent service! Highly
                                recommend the pasta dishes.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              J
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm text-gray-800">
                                  Jane Doe
                                </span>
                                <span className="text-xs text-gray-500">
                                  1 week ago
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Nice ambiance and friendly staff. The prices are
                                reasonable too.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Add more placeholder comments */}
                        <div className="text-center text-gray-400 text-sm py-4">
                          {currentRestaurant?.total_comments === 0
                            ? "No comments available"
                            : "More comments will be loaded here..."}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
