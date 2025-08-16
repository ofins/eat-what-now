import type {
  RestaurantGoogleDetails,
  RoutingSummary,
} from "@ewn/types/restaurants.type";
import React, { useState } from "react";
import AddRestaurantModal from "./AddRestaurantModal";

export interface SearchResult {
  places: RestaurantGoogleDetails[];
  routingSummaries: RoutingSummary[];
}

interface SearchResultListProps {
  searchResults: SearchResult;
  onSelectPlace: (place: RestaurantGoogleDetails) => void;
  onAddToDatabase?: (place: RestaurantGoogleDetails) => Promise<void>;
  loading?: boolean;
}

const SearchResultList: React.FC<SearchResultListProps> = ({
  searchResults,
  onSelectPlace,
  onAddToDatabase,
  loading = false,
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [modalPlace, setModalPlace] = useState<RestaurantGoogleDetails | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getPriceLevelDisplay = (priceLevel: string) => {
    switch (priceLevel) {
      case "PRICE_LEVEL_FREE":
        return "Free";
      case "PRICE_LEVEL_INEXPENSIVE":
        return "$";
      case "PRICE_LEVEL_MODERATE":
        return "$$";
      case "PRICE_LEVEL_EXPENSIVE":
        return "$$$";
      case "PRICE_LEVEL_VERY_EXPENSIVE":
        return "$$$$";
      default:
        return "$$";
    }
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (duration: string) => {
    const seconds = parseInt(duration.replace("s", ""));
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.round(seconds / 60);
    return `${minutes}m`;
  };

  const handleCardClick = (
    place: RestaurantGoogleDetails,
    e: React.MouseEvent
  ) => {
    // Check if the click target is a button or link
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.closest("button, a")
    ) {
      return; // Don't expand if clicking on interactive elements
    }

    // Toggle expansion
    setExpandedItem(expandedItem === place.id ? null : place.id);
  };

  const handleModalConfirm = async (place: RestaurantGoogleDetails) => {
    if (onAddToDatabase) {
      await onAddToDatabase(place);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalPlace(null);
  };

  if (loading) {
    return (
      <div className="w-full h-full overflow-hidden">
        <div className="animate-pulse space-y-1.5 p-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="bg-white rounded-md shadow-sm border border-gray-100 p-2"
            >
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!searchResults.places || searchResults.places.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center py-4">
          <div className="text-gray-400 text-xl mb-2">🔍</div>
          <p className="text-gray-500 text-sm font-medium">
            No restaurants found
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Try searching in a different area
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-3 lg:px-4 py-2 lg:py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm lg:text-base font-semibold text-gray-800">
            Search Results
          </h3>
          <p className="text-xs lg:text-sm text-gray-500">
            {searchResults.places.length} found
          </p>
        </div>
      </div>

      {/* Scrollable Results */}
      <div className="flex-1 overflow-y-auto max-h-[70vh] lg:max-h-[75vh]">
        {/* Mobile Layout: Single Column List */}
        <div className="block lg:hidden px-3">
          <div className="divide-y divide-gray-100">
            {searchResults.places.map((place, index) => {
              const routing = searchResults.routingSummaries[index];
              const isExpanded = expandedItem === place.id;

              return (
                <div
                  key={place.id}
                  className="bg-white cursor-pointer transition-all duration-200 hover:bg-gray-50"
                  onClick={(e) => handleCardClick(place, e)}
                >
                  {/* Mobile Compact Card */}
                  <div className="py-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Restaurant Image */}
                      <div className="w-6 h-6 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          🍽️
                        </div>
                      </div>

                      {/* Restaurant Info - Single Line */}
                      <div className="flex-1 min-w-0 mr-2">
                        <div className="flex items-center justify-between min-w-0">
                          <div className="flex-1 min-w-0 mr-2">
                            <h4 className="font-small text-gray-800 text-sm truncate">
                              {place.displayName.text}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {place.formattedAddress}
                            </p>
                          </div>

                          {/* Price and Distance - Stack on very small screens */}
                          <div className="flex sm:flex-row items-end sm:items-center gap-1 sm:gap-2 flex-shrink-0">
                            <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded-full whitespace-nowrap">
                              {getPriceLevelDisplay(place.priceLevel)}
                            </span>
                            {routing &&
                              routing.legs &&
                              routing.legs.length > 0 && (
                                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                                  {formatDistance(
                                    routing.legs[0].distanceMeters
                                  )}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Expand Icon - Always visible */}
                      <div className="flex-shrink-0 w-6 flex justify-center">
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 pb-3 bg-gray-50">
                      <div className="pt-3 space-y-3">
                        {/* Actions */}
                        <div className="flex gap-2 overflow-x-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalPlace(place);
                              setIsModalOpen(true);
                            }}
                            className="bg-blue-600 text-white py-1.5 px-3 rounded-md text-xs font-medium hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1 whitespace-nowrap"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            Add
                          </button>

                          {place.googleMapsUri && (
                            <a
                              href={place.googleMapsUri}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-green-600 text-white py-1.5 px-3 rounded-md text-xs font-medium hover:bg-green-700 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1 whitespace-nowrap"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Maps
                            </a>
                          )}

                          {place.websiteUri && (
                            <a
                              href={place.websiteUri}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-gray-600 text-white py-1.5 px-3 rounded-md text-xs font-medium hover:bg-gray-700 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1 whitespace-nowrap"
                            >
                              <svg
                                className="w-3 h-3"
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
                              Web
                            </a>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPlace(place);
                            }}
                            className="bg-purple-600 text-white py-1.5 px-3 rounded-md text-xs font-medium hover:bg-purple-700 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1 whitespace-nowrap"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Layout: Grid */}
        <div className="hidden lg:block p-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
            {searchResults.places.map((place, index) => {
              const routing = searchResults.routingSummaries[index];
              const isExpanded = expandedItem === place.id;

              return (
                <div
                  key={place.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-200 flex flex-col h-28"
                  onClick={(e) => handleCardClick(place, e)}
                >
                  {!isExpanded ? (
                    /* Normal Card Content */
                    <div className="p-2 flex flex-col h-full">
                      <div className="flex gap-2 flex-1">
                        {/* Restaurant Image */}
                        <div className="w-8 h-8 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            🍽️
                          </div>
                        </div>

                        {/* Restaurant Info */}
                        <div className="flex-1 min-w-0">
                          {/* Name and Price */}
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-gray-800 text-xs leading-tight pr-1 line-clamp-2">
                              {place.displayName.text}
                            </h4>
                          </div>

                          {/* Address */}
                          <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                            {place.formattedAddress}
                          </p>

                          {/* Price, Distance, and Duration */}
                          {routing &&
                            routing.legs &&
                            routing.legs.length > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-green-600 font-medium text-xs bg-green-50 px-1 py-0.5 rounded-full flex-shrink-0 ml-1">
                                  {getPriceLevelDisplay(place.priceLevel)}
                                </span>
                                <span className="bg-blue-50 text-blue-600 px-1 py-0.5 rounded-full text-xs font-medium">
                                  {formatDistance(
                                    routing.legs[0].distanceMeters
                                  )}
                                </span>
                                <span className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded-full text-xs">
                                  {formatDuration(routing.legs[0].duration)}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Expanded Actions Content */
                    <div className="p-2 flex flex-col h-full">
                      <div className="text-center mb-2 flex">
                        <h4 className="font-medium text-gray-800 text-xs mb-1 line-clamp-1">
                          {place.displayName.text}
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-1 w-full">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalPlace(place);
                            setIsModalOpen(true);
                          }}
                          className="bg-blue-600 text-white py-1.5 px-2 rounded-md text-xs font-medium hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Add
                        </button>

                        {place.googleMapsUri && (
                          <a
                            href={place.googleMapsUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-green-600 text-white py-1.5 px-2 rounded-md text-xs font-medium hover:bg-green-700 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Maps
                          </a>
                        )}

                        {place.websiteUri && (
                          <a
                            href={place.websiteUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-600 text-white py-1.5 px-2 rounded-md text-xs font-medium hover:bg-gray-700 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1"
                          >
                            <svg
                              className="w-3 h-3"
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
                            Web
                          </a>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPlace(place);
                          }}
                          className="bg-purple-600 text-white py-1.5 px-2 rounded-md text-xs font-medium hover:bg-purple-700 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Select
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-3 py-1 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400 text-center">Tap to select</p>
      </div>

      {/* Add Restaurant Modal */}
      <AddRestaurantModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        place={modalPlace}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default SearchResultList;
