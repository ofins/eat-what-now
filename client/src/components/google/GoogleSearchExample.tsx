import React, { useState } from "react";
import SearchResultList from "./SearchResultList";
import mockData from "./data.json";

interface Place {
  id: string;
  formattedAddress: string;
  priceLevel: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  photos: Array<{
    name: string;
    widthPx: number;
    heightPx: number;
  }>;
}

const GoogleSearchExample: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    console.log("Selected place:", place);
    // Here you would typically:
    // 1. Add the restaurant to your database
    // 2. Navigate to the restaurant details
    // 3. Close the search modal
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Restaurant Search
        </h1>

        {/* Search Input Mockup */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search restaurants nearby..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              defaultValue="Pizza near Times Square"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Search
            </button>
          </div>
        </div>

        {/* Compact Search Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SearchResultList
            searchResults={mockData}
            onSelectPlace={handleSelectPlace}
            loading={false}
          />
        </div>

        {/* Selected Place Display */}
        {selectedPlace && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-2">
              Selected Restaurant:
            </h3>
            <p className="text-sm text-blue-700">
              {selectedPlace.displayName.text}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {selectedPlace.formattedAddress}
            </p>

            <div className="mt-3 flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Add to Database
              </button>
              <button
                onClick={() => setSelectedPlace(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleSearchExample;
