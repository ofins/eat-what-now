import type { IRestaurant } from "@ewn/types/restaurants.type";
import { useInfiniteQuery } from "@tanstack/react-query";

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

// Extended restaurant interface to include comments array

const PAGE_LIMIT = 10;

export function useFeedData(
  location: { latitude: number; longitude: number } | null
) {
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
        `${import.meta.env.VITE_API_BASE_URL}/feed?offset=${pageParam}&limit=${PAGE_LIMIT}&longitude=${location?.longitude}&latitude=${location?.latitude}&radius=500`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch feed");
      return response.json();
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.meta.page >= lastPage.meta.totalPages) {
        return undefined;
      }
      return pages.length * PAGE_LIMIT;
    },
    initialPageParam: 0,
    enabled: !!location,
  });

  const restaurants = data?.pages.flatMap((page) => page.data) || [];

  return {
    restaurants: restaurants,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
}
