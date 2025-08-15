import type { RestaurantGoogleDetails } from "@ewn/types/restaurants.type";
import React, { useState } from "react";
import Modal from "../shared/Modal";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleConfirm = async () => {
    if (!place) return;

    setIsLoading(true);
    setError(null); // Clear any previous errors
    try {
      await onConfirm(place);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding restaurant:", error);
      setError(
        error instanceof Error
          ? `Failed to add restaurant: ${error.message}`
          : "An unexpected error occurred while adding the restaurant. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  if (!place) return null;

  return (
    <>
      <Modal
        isOpen={isOpen && !showSuccessModal}
        onClose={onClose}
        title="Add Restaurant to List"
        maxWidth="md"
      >
        <div className="space-y-4">
          {/* Restaurant Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex gap-4">
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
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  Add this restaurant to your list?
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  This will import the restaurant information and make it
                  available in your feed for users to discover and interact
                  with.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="text-red-500 mt-0.5">
                  <svg
                    className="w-4 h-4"
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
                <div>
                  <p className="text-sm text-red-800 font-medium">
                    Error Adding Restaurant
                  </p>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

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
                  Add to List
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

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Thank You!"
        maxWidth="md"
      >
        <div className="space-y-6 py-2">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
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
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Restaurant Successfully Added!
            </h3>
            <p className="text-gray-600 mb-4">
              Thank you for contributing to our restaurant database. Your
              addition helps the entire community discover great places to eat!
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium text-blue-600">
                {place.displayName.text}
              </span>{" "}
              is now available in the feed for everyone to discover, upvote, and
              comment on.
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleSuccessModalClose}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Great, Got It!
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddRestaurantModal;
