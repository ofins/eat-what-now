import type { IRestaurant } from "@ewn/types/restaurants.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
}

const Feed = ({ location }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efficient infinite data fetching
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<FeedResponse>({
    queryKey: ["feed"],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/feed?offset=${pageParam}&limit=${PAGE_LIMIT}`
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
  });

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
      <div className="relative w-80 h-[60%] max-w-sm mt-6 ">
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
            <div className="h-full flex flex-col">
              {/* Image Section - Fixed height */}
              <div className="w-full h-32 flex-shrink-0 bg-gray-100 rounded-t-2xl overflow-hidden">
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
              <div className="flex-1 flex flex-col p-4 min-h-0">
                {/* Restaurant Name - Fixed height */}
                <div className="flex-shrink-0 mb-3">
                  <h2 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight">
                    {currentRestaurant?.name}
                  </h2>
                </div>

                {/* Address - Fixed height */}
                <div className="flex-shrink-0 mb-3">
                  <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                    {currentRestaurant?.address}
                  </p>
                </div>

                {/* Rating and Distance Row */}
                <div className="flex-shrink-0 flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-sm">
                      {"★".repeat(Math.floor(currentRestaurant?.rating || 0))}
                      {"☆".repeat(
                        5 - Math.floor(currentRestaurant?.rating || 0)
                      )}
                    </span>
                    <span className="text-xs text-gray-500 font-medium ml-1">
                      {Number(currentRestaurant?.rating).toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                    {calculateDistance(
                      currentRestaurant?.latitude || 0,
                      currentRestaurant?.longitude || 0,
                      location?.latitude || 0,
                      location?.longitude || 0
                    ).toFixed(1)}{" "}
                    km
                  </div>
                </div>

                {/* Price Range */}
                <div className="flex-shrink-0 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Price:</span>
                    <span className="text-green-600 font-medium text-sm">
                      {"$".repeat(
                        Math.floor(currentRestaurant?.price_range || 1)
                      )}
                    </span>
                  </div>
                </div>

                {/* Stats Grid - Fixed height */}
                <div className="flex-shrink-0 mt-auto pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-green-500 text-sm">👍</span>
                      <span className="text-xs text-gray-600">
                        {currentRestaurant?.total_upvotes || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-red-500 text-sm">👎</span>
                      <span className="text-xs text-gray-600">
                        {currentRestaurant?.total_downvotes || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-pink-500 text-sm">❤️</span>
                      <span className="text-xs text-gray-600">
                        {currentRestaurant?.total_favorites || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-500 text-sm">💬</span>
                      <span className="text-xs text-gray-600">
                        {currentRestaurant?.total_comments || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Counter */}
      <div className="mt-6 text-sm text-gray-600 font-medium">
        {currentIndex + 1} of {restaurants.length}
        {hasNextPage && " (loading more...)"}
      </div>

      {/* Next Button */}
      <div className="mt-8">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium shadow-md transition-colors"
        >
          Next Restaurant
        </button>
      </div>

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
