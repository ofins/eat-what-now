import type { IRestaurant } from "@ewn/types/restaurants.type";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { updateRestaurantVote } from "../../api/restaurants-user";
import type { UserProfileResponse } from "../About";

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

const Feed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!localStorage.getItem("token");
  const { data: userData } = useQuery<UserProfileResponse>({
    queryKey: ["users/profile"],
    enabled: isLoggedIn,
  });

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

  const mutation = useMutation({ mutationFn: updateRestaurantVote });

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

  // Handle touch/mouse events for swiping
  const handleStart = (clientX: number, clientY: number) => {
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragStart || !isDragging) return;

    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    // Allow both horizontal and slight vertical movement for natural feel
    setDragOffset({ x: deltaX, y: deltaY * 0.1 }); // Reduce vertical movement
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const threshold = 80; // Minimum swipe distance (reduced for easier swiping)

    if (
      Math.abs(dragOffset.x) > threshold &&
      currentIndex < restaurants.length - 1
    ) {
      setCurrentIndex((prev) => prev + 1);
      if (dragOffset.x > 0) {
        handleSwipeRight();
      } else {
        handleSwipeLeft();
      }
    }

    // Reset drag state
    setDragStart(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // e.preventDefault(); // Prevent scrolling, this is causing issues.
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const handleSwipeLeft = () => {
    console.log("Swiped left");
  };

  const handleSwipeRight = () => {
    console.log("Swiped right");
    mutation.mutate({
      upvoted: true,
      user_id: userData?.data.id,
      restaurant_id: restaurants[currentIndex].id,
    });
  };

  console.log(restaurants[currentIndex]);

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
  const nextRestaurant = restaurants[currentIndex + 1];
  const nextNextRestaurant = restaurants[currentIndex + 2];

  // Calculate rotation and opacity based on drag
  const rotation = dragOffset.x * 0.1; // Max 10 degrees rotation per 100px drag
  const opacity = 1 - Math.abs(dragOffset.x) / 300; // Fade out as we swipe

  return (
    <div className="flex flex-col items-center h-screen min-h-[400px] px-4">
      {/* Tinder-like Card Stack Container */}
      <div className="relative w-80 h-96 max-w-sm">
        {/* Third card (background) */}
        {nextNextRestaurant && (
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
        )}

        {/* Second card (middle) */}
        {nextRestaurant && (
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
              <p className="text-gray-500 mt-2">
                {nextRestaurant.cuisine_type}
              </p>
            </div>
          </div>
        )}

        {/* Current card (top) */}
        <div
          ref={cardRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{
            transform: `
              translateX(${dragOffset.x}px) 
              translateY(${dragOffset.y}px) 
              rotate(${rotation}deg)
            `,
            opacity: opacity,
            transition: isDragging
              ? "none"
              : "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            zIndex: 3,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-full h-full bg-white rounded-2xl shadow-xl border-2 border-gray-100">
            <div className="h-full flex flex-col justify-between p-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentRestaurant?.name}
                </h2>
                <p className="text-gray-600 mb-3">
                  {currentRestaurant?.address}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {currentRestaurant?.cuisine_type}
                  </span>
                  <span className="text-yellow-500 text-lg">
                    {"★".repeat(Math.floor(currentRestaurant?.rating || 0))}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {currentRestaurant?.rating}
                  </span>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Price:{" "}
                  {"$".repeat(Math.floor(currentRestaurant?.price_range || 1))}
                </div>
              </div>

              {/* Swipe indicators */}
              {isDragging && (
                <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                  <div
                    className={`px-4 py-2 rounded-full font-bold text-white transition-opacity ${
                      dragOffset.x > 50
                        ? "opacity-100 bg-green-500"
                        : "opacity-0"
                    }`}
                  >
                    LIKE
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-bold text-white transition-opacity ${
                      dragOffset.x < -50
                        ? "opacity-100 bg-red-500"
                        : "opacity-0"
                    }`}
                  >
                    PASS
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Counter */}
      <div className="mt-6 text-sm text-gray-600 font-medium">
        {currentIndex + 1} of {restaurants.length}
        {hasNextPage && " (loading more...)"}
      </div>

      {/* Swipe Instructions */}
      {/* <div className="mt-8 text-center">
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() =>
              currentIndex < restaurants.length - 1 &&
              setCurrentIndex((prev) => prev + 1)
            }
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 shadow-sm"
            disabled={currentIndex >= restaurants.length - 1 && !hasNextPage}
          >
            PASS
          </button>
          <button
            onClick={() =>
              currentIndex < restaurants.length - 1 &&
              setCurrentIndex((prev) => prev + 1)
            }
            className="px-4 py-2 bg-[#EF2A39] text-white rounded-lg hover:bg-red-600 disabled:opacity-50 shadow-sm"
            disabled={currentIndex >= restaurants.length - 1 && !hasNextPage}
          >
            LIKE
          </button>
        </div>
      </div> */}

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
