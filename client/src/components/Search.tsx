import type { RestaurantGoogleDetails } from "@ewn/types/restaurants.type";
import type { IUser } from "@ewn/types/users.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { createRestaurant, searchRestaurantsByText } from "../api/restaurants";
import { useLocation } from "../hooks/useLocation";
import SearchResultList, { type SearchResult } from "./google/SearchResultList";

const googlePriceLevelToNum = (priceLevel: string | undefined): number => {
  if (!priceLevel) return 1; // Default to 0 if no price level is provided
  const priceMap: Record<string, number> = {
    PRICE_LEVEL_FREE: 1,
    PRICE_LEVEL_INEXPENSIVE: 1,
    PRICE_LEVEL_MODERATE: 2,
    PRICE_LEVEL_EXPENSIVE: 3,
    PRICE_LEVEL_VERY_EXPENSIVE: 4,
  };
  return priceMap[priceLevel] ?? 0; // Return 0 if the price level is unknown
};

const Search = () => {
  const { location } = useLocation();
  const [data, setData] = useState<SearchResult>({
    places: [],
    routingSummaries: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for location availability
  useEffect(() => {
    // If we've tried to get location but it's still null after a delay, show an error
    const timer = setTimeout(() => {
      if (!location && !isSearching) {
        setError(
          "Unable to get your location. Please enable location services in your browser settings."
        );
      } else if (location) {
        // Clear location error if location becomes available
        setError((prev) => (prev?.includes("location") ? null : prev));
      }
    }, 3000); // Wait 3 seconds before showing the error

    return () => clearTimeout(timer);
  }, [location, isSearching]);

  const mutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: (response: Response) => {
      console.log("Restaurant added successfully:", response);
      // The modal handles success display
    },
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError(null); // Clear any previous errors

    if (!location?.latitude || !location?.longitude) {
      setError(
        "Location is not available. Please allow location access and try again."
      );
      setIsSearching(false);
      return;
    }

    try {
      const results = await searchRestaurantsByText(searchQuery, {
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setData(results);

      // Show "no results" message as an error if needed
      if (results.places.length === 0) {
        setError(
          `No restaurants found for "${searchQuery}". Try a different search term or location.`
        );
      }
    } catch (error) {
      console.error("Error searching restaurants:", error);
      setError(
        error instanceof Error
          ? `Search failed: ${error.message}`
          : "An unexpected error occurred while searching. Please try again later."
      );
      // Keep the previous search results if there's an error
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const { data: userData } = useQuery<{ data: IUser }>({
    queryKey: ["users/profile"], // Path matches API endpoint
  });

  const handleAddToDatabase = async (place: RestaurantGoogleDetails) => {
    console.log("Adding restaurant to database:", place);

    // Clear any previous errors
    setError(null);

    if (!userData?.data.id) {
      throw new Error("You must be logged in to add restaurants.");
    }

    // Use mutateAsync to properly throw errors
    await mutation.mutateAsync({
      google_id: place.id,
      name: place.displayName.text,
      address: place.formattedAddress,
      price_range: googlePriceLevelToNum(place.priceLevel),
      longitude: place.location.longitude,
      latitude: place.location.latitude,
      website: place.websiteUri,
      outbound_link: place.googleMapsUri,
      contributor_username: userData?.data.username,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search Box */}
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="py-3 lg:py-6">
            <h1 className="text-lg lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4 text-center">
              Restaurant Search
            </h1>

            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search restaurants, cuisine, location..."
                className="block w-full pl-10 lg:pl-12 pr-2 sm:pr-32 py-2.5 lg:py-4 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm lg:text-base placeholder-gray-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 lg:pr-3">
                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  className="bg-blue-600 text-white px-2 sm:px-4 py-2 lg:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center gap-1 lg:gap-2"
                >
                  {isSearching ? (
                    <>
                      <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Searching...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span className="hidden sm:inline">Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 lg:gap-3 overflow-x-auto pb-2 mt-3 lg:mt-4 max-w-4xl mx-auto">
              {[
                "Pizza",
                "Sushi",
                "Italian",
                "Chinese",
                "Mexican",
                "Thai",
                "Burgers",
                "Coffee",
                "Dessert",
              ].map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => {
                    setSearchQuery(cuisine);
                    // Auto-search when filter is clicked
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="flex-shrink-0 px-3 py-1.5 lg:px-4 lg:py-2 bg-gray-100 text-gray-700 rounded-full text-xs lg:text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors whitespace-nowrap"
                >
                  {cuisine}
                </button>
              ))}
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="mt-3 lg:mt-4 max-w-2xl mx-auto bg-red-50 border-l-4 border-red-500 p-3 lg:p-4 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg
                      className="h-4 w-4 lg:h-5 lg:w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-2 lg:ml-3 flex-1">
                    <p className="text-xs lg:text-sm text-red-700">{error}</p>
                  </div>
                  <div className="ml-auto pl-2 lg:pl-3">
                    <div className="-mx-1.5 -my-1.5">
                      <button
                        onClick={() => setError(null)}
                        className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                      >
                        <span className="sr-only">Dismiss</span>
                        <svg
                          className="h-3 w-3 lg:h-4 lg:w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 lg:py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SearchResultList
            searchResults={data}
            loading={isSearching}
            onSelectPlace={(place) => {
              console.log("Selected place:", place);
            }}
            onAddToDatabase={handleAddToDatabase}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
