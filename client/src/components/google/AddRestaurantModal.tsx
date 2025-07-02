import React, { useState } from "react";
import Modal from "../shared/Modal";
import type { RestaurantGoogleDetails } from "@ewn/types/restaurants.type";

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

interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: RestaurantGoogleDetails | null;
  onConfirm: (place: RestaurantGoogleDetails) => Promise<void>;
}

const AddRestaurantModal: React.FC<AddRestaurantModalProps> = ({
  isOpen,
  onClose,
  place,
  onConfirm,
}) => {
  const [isLoading, setIsLoading] = useState(false);

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

  const getPhotoUrl = (photo: Photo, maxWidth = 400) => {
    const photoRef = photo.name.split("/photos/")[1];
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoRef}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
  };

  const handleConfirm = async () => {
    if (!place) return;

    setIsLoading(true);
    try {
      await onConfirm(place);
      onClose();
    } catch (error) {
      console.error("Error adding restaurant:", error);
      // Could add error toast here
    } finally {
      setIsLoading(false);
    }
  };

  if (!place) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Restaurant to Database"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Restaurant Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex gap-4">
            {/* Image */}
            <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
              {place.photos && place.photos.length > 0 ? (
                <img
                  src={getPhotoUrl(place.photos[0], 200)}
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
                className={`w-full h-full flex items-center justify-center text-gray-400 text-2xl ${place.photos && place.photos.length > 0 ? "hidden" : ""}`}
              >
                🍽️
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg mb-1">
                {place.displayName.text}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {place.formattedAddress}
              </p>
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  {getPriceLevelDisplay(place.priceLevel)}
                </span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                  Google Places
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="text-blue-500 mt-0.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Add this restaurant to your database?
              </p>
              <p className="text-xs text-blue-700 mt-1">
                This will import the restaurant information and make it
                available in your feed for users to discover and interact with.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add to Database
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddRestaurantModal;
