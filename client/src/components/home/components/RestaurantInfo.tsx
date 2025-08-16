import type { IRestaurant } from "@ewn/types/restaurants.type";
import React, { useState } from "react";
import { calculateDistance } from "../../../utils/common";

interface RestaurantInfoProps {
  restaurant: IRestaurant;
  isExpanded: boolean;
  location: { latitude: number; longitude: number } | null;
  isLoggedIn?: boolean;
  onRating?: (rating: number) => void;
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({
  restaurant,
  isExpanded,
  location,
  isLoggedIn = false,
  onRating,
}) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);

  const handleRatingClick = async (rating: number) => {
    if (onRating) {
      await onRating(rating);
      setSubmittedRating(rating);
      setShowConfirmModal(true);
      // Auto-hide modal after 2 seconds
      setTimeout(() => {
        setShowConfirmModal(false);
      }, 2000);
    }
  };

  return (
    <>
      {/* Restaurant Name */}
      <div className="flex-shrink-0 mb-2">
        <h2
          className={`font-bold text-gray-800 line-clamp-2 leading-tight ${
            isExpanded ? "text-base" : "text-sm lg:text-base"
          }`}
        >
          {restaurant?.name}
        </h2>
      </div>

      {/* Address */}
      <div className="flex-shrink-0 mb-2">
        <p
          className={`text-gray-600 line-clamp-2 leading-relaxed ${
            isExpanded ? "text-xs" : "text-xs lg:text-xs"
          }`}
        >
          {restaurant?.address}
        </p>
      </div>

      {/* Rating and Distance Row */}
      <div className="flex-shrink-0 flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          {isLoggedIn && onRating ? (
            <div
              className="flex items-center gap-0.5"
              onMouseLeave={() => setHoveredStar(null)}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const currentRating = Math.floor(restaurant?.rating || 0);
                const shouldHighlight = hoveredStar
                  ? star <= hoveredStar
                  : star <= currentRating;
                const isHovering = hoveredStar !== null && star <= hoveredStar;

                return (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    className={`text-lg transition-colors duration-150 hover:scale-110 transform cursor-pointer ${
                      shouldHighlight
                        ? isHovering
                          ? "text-yellow-600"
                          : "text-yellow-500"
                        : "text-gray-300 hover:text-yellow-400"
                    } ${isExpanded ? "text-xs" : "text-xs lg:text-xs"}`}
                    aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                );
              })}
            </div>
          ) : (
            <span
              className={`text-yellow-500 ${isExpanded ? "text-xs" : "text-xs lg:text-xs"}`}
            >
              {"★".repeat(Math.floor(restaurant?.rating || 0))}
              {"☆".repeat(5 - Math.floor(restaurant?.rating || 0))}
            </span>
          )}
          <span
            className={`text-gray-500 font-medium ml-1 ${
              isExpanded ? "text-xs" : "text-xs lg:text-xs"
            }`}
          >
            {Number(restaurant?.rating).toFixed(1)}
          </span>
        </div>
        <div
          className={`text-gray-600 bg-gray-50 px-2 py-1 rounded-full ${
            isExpanded ? "text-xs" : "text-xs lg:text-xs"
          }`}
        >
          {calculateDistance(
            restaurant?.latitude || 0,
            restaurant?.longitude || 0,
            location?.latitude || 0,
            location?.longitude || 0
          ).toFixed(1)}{" "}
          km
        </div>
      </div>

      {/* Price Range and Outbound Link */}
      <div className="flex-shrink-0 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-gray-500 ${isExpanded ? "text-xs" : "text-xs lg:text-xs"}`}
            >
              Price:
            </span>
            <span
              className={`text-green-600 font-medium ${
                isExpanded ? "text-xs" : "text-xs"
              }`}
            >
              {"$".repeat(Math.floor(restaurant?.price_range || 1))}
            </span>
          </div>

          {/* Outbound Link Button */}
          {restaurant?.outbound_link && (
            <a
              href={restaurant.outbound_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm ${
                isExpanded
                  ? "px-3 py-1.5 text-xs font-medium"
                  : "px-2.5 py-1 text-xs font-medium"
              }`}
            >
              <span>Visit</span>
              <svg
                className={`${isExpanded ? "w-4 h-4" : "w-3 h-3"}`}
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
            </a>
          )}
        </div>
      </div>

      {/* Rating Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full shadow-xl">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Rating Submitted!
                </h3>
                <p className="text-gray-600 mb-4">
                  You rated this restaurant{" "}
                  <span className="font-semibold text-yellow-500">
                    {submittedRating} star{submittedRating !== 1 ? "s" : ""}
                  </span>
                </p>
                <div className="flex justify-center">
                  <span className="text-yellow-500 text-xl">
                    {"★".repeat(submittedRating || 0)}
                    {"☆".repeat(5 - (submittedRating || 0))}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantInfo;
