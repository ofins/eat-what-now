import type { IRestaurant } from "@ewn/types/restaurants.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

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

const PAGE_LIMIT = 2;

const Feed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

  // Flatten all pages into a single array
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

    // Only allow horizontal swiping (ignore if more vertical than horizontal)
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    setDragOffset({ x: deltaX, y: 0 });
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const threshold = 100; // Minimum swipe distance

    if (dragOffset.x < -threshold && currentIndex < restaurants.length - 1) {
      // Swipe left - next card
      setCurrentIndex((prev) => prev + 1);
    } else if (dragOffset.x > threshold && currentIndex > 0) {
      // Swipe right - previous card
      setCurrentIndex((prev) => prev - 1);
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
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
      {/* Card Counter */}
      <div className="mb-4 text-sm text-gray-600">
        {currentIndex + 1} of {restaurants.length}
        {hasNextPage && " (loading more...)"}
      </div>

      {/* Swipeable Card Container */}
      <div className="relative w-full max-w-sm h-96 perspective-1000">
        <div
          ref={cardRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{
            transform: `translateX(${dragOffset.x}px) ${dragOffset.x !== 0 ? `rotateY(${dragOffset.x * 0.1}deg)` : ""}`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Current Card */}
          <div className="w-full h-full bg-white rounded-xl shadow-lg p-6 border">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentRestaurant?.name}
                </h2>
                <p className="text-gray-600 mb-3">
                  {currentRestaurant?.address}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {currentRestaurant?.cuisine_type}
                  </span>
                  <span className="text-yellow-500">
                    {"★".repeat(Math.floor(currentRestaurant?.rating || 0))}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentRestaurant?.rating}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Price:{" "}
                  {"$".repeat(Math.floor(currentRestaurant?.price_range || 1))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() =>
                    currentIndex > 0 && setCurrentIndex((prev) => prev - 1)
                  }
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  disabled={currentIndex === 0}
                >
                  ← Previous
                </button>
                <button
                  onClick={() =>
                    currentIndex < restaurants.length - 1 &&
                    setCurrentIndex((prev) => prev + 1)
                  }
                  className="px-4 py-2 bg-[#EF2A39] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  disabled={
                    currentIndex >= restaurants.length - 1 && !hasNextPage
                  }
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Next card preview (slightly behind) */}
        {currentIndex < restaurants.length - 1 && (
          <div
            className="absolute inset-0 bg-white rounded-xl shadow-lg border opacity-50 -z-10"
            style={{
              transform: "translateX(10px) translateY(10px) scale(0.95)",
            }}
          >
            <div className="w-full h-full p-6">
              <h3 className="text-xl font-bold text-gray-800">
                {restaurants[currentIndex + 1]?.name}
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* Swipe Instructions */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Swipe left/right or use buttons to navigate
      </div>

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="mt-2 text-sm text-blue-500">
          Loading more restaurants...
        </div>
      )}
    </div>
  );
};

export default Feed;
