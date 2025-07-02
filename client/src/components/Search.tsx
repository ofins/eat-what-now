import React, { useState } from "react";
import SearchResultList, { type SearchResult } from "./google/SearchResultList";
import { createRestaurant, searchRestaurantsByText } from "../api/restaurants";
import type { RestaurantGoogleDetails } from "@ewn/types/restaurants.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { IUser } from "@ewn/types/users.type";

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
  const [data, setData] = useState<SearchResult>({
    places: [],
    routingSummaries: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const mutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: (data) => {
      console.log("Restaurant added successfully:", data);
      // Optionally, you can refresh the search results or show a success message
    },
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    try {
      const results = await searchRestaurantsByText(searchQuery, {
        latitude: 25.0396385,
        longitude: 121.5310953,
      });
      setData(results);
    } catch (error) {
      console.error("Error searching restaurants:", error);
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
    // TODO: Implement actual API call to add restaurant to database
    mutation.mutate({
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

    // Show success message (you could add a toast notification here)
    alert(`${place.displayName.text} has been added to the database!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search Box */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto p-4">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-800 mb-3 text-center">
              Restaurant Search
            </h1>

            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
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
                className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm placeholder-gray-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  {isSearching ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Searching...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
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
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["Pizza", "Sushi", "Italian", "Chinese", "Mexican", "Thai"].map(
              (cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => {
                    setSearchQuery(cuisine);
                    // Auto-search when filter is clicked
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="flex-shrink-0 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {cuisine}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-md mx-auto p-4">
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
