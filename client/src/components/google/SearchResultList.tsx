import React from "react";

interface Photo {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: Array<{
    displayName: string;
    uri: string;
    photoUri: string;
  }>;
  flagContentUri: string;
  googleMapsUri: string;
}

interface Place {
  id: string;
  formattedAddress: string;
  priceLevel: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  photos: Photo[];
}

interface RoutingSummary {
  legs: Array<{
    duration: string;
    distanceMeters: number;
  }>;
  directionsUri: string;
}

interface SearchResult {
  places: Place[];
  routingSummaries: RoutingSummary[];
}

interface SearchResultListProps {
  searchResults: SearchResult;
  onSelectPlace: (place: Place) => void;
  loading?: boolean;
}

const SearchResultList: React.FC<SearchResultListProps> = ({
  searchResults,
  onSelectPlace,
  loading = false,
}) => {
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

  const getPhotoUrl = (photo: Photo, maxWidth = 400) => {
    // Extract photo reference from the name field
    const photoRef = photo.name.split("/photos/")[1];
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoRef}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
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
    <div className="w-full h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-3 py-1.5 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">
            Search Results
          </h3>
          <p className="text-xs text-gray-500">
            {searchResults.places.length} found
          </p>
        </div>
      </div>

      {/* Scrollable Results */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-1.5 space-y-1.5">
          {searchResults.places.map((place, index) => {
            const routing = searchResults.routingSummaries[index];

            return (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className="bg-white rounded-md shadow-sm border border-gray-100 p-2 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-blue-200 active:scale-[0.98]"
              >
                <div className="flex gap-2">
                  {/* Restaurant Image */}
                  <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    {place.photos && place.photos.length > 0 ? (
                      <img
                        src={getPhotoUrl(place.photos[0], 80)}
                        alt={place.displayName.text}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full flex items-center justify-center text-gray-400 text-sm ${place.photos && place.photos.length > 0 ? "hidden" : ""}`}
                    >
                      🍽️
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="flex-1 min-w-0">
                    {/* Name and Price */}
                    <div className="flex items-start justify-between mb-0.5">
                      <h4 className="font-medium text-gray-800 text-sm leading-tight line-clamp-1 flex-1 mr-2">
                        {place.displayName.text}
                      </h4>
                      <span className="text-green-600 font-medium text-xs bg-green-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        {getPriceLevelDisplay(place.priceLevel)}
                      </span>
                    </div>

                    {/* Address */}
                    <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                      {place.formattedAddress}
                    </p>

                    {/* Distance and Duration */}
                    {routing && routing.legs && routing.legs.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-xs font-medium">
                          {formatDistance(routing.legs[0].distanceMeters)}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">
                          {formatDuration(routing.legs[0].duration)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  <div className="flex-shrink-0 flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-200 transition-colors hover:border-blue-400"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-3 py-1 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400 text-center">Tap to select</p>
      </div>
    </div>
  );
};

export default SearchResultList;
