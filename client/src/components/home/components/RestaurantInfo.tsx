import type { IRestaurant } from "@ewn/types/restaurants.type";
import React from "react";
import { calculateDistance } from "../../../utils/common";

interface RestaurantInfoProps {
  restaurant: IRestaurant;
  isExpanded: boolean;
  location: { latitude: number; longitude: number } | null;
}

const RestaurantInfo: React.FC<RestaurantInfoProps> = ({
  restaurant,
  isExpanded,
  location,
}) => {
  return (
    <>
      {/* Restaurant Name */}
      <div className="flex-shrink-0 mb-3">
        <h2
          className={`font-bold text-gray-800 line-clamp-2 leading-tight ${
            isExpanded ? "text-2xl" : "text-base lg:text-lg"
          }`}
        >
          {restaurant?.name}
        </h2>
      </div>

      {/* Address */}
      <div className="flex-shrink-0 mb-3">
        <p
          className={`text-gray-600 line-clamp-2 leading-relaxed ${
            isExpanded ? "text-sm" : "text-xs lg:text-sm"
          }`}
        >
          {restaurant?.address}
        </p>
      </div>

      {/* Rating and Distance Row */}
      <div className="flex-shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <span
            className={`text-yellow-500 ${isExpanded ? "text-base" : "text-xs lg:text-sm"}`}
          >
            {"★".repeat(Math.floor(restaurant?.rating || 0))}
            {"☆".repeat(5 - Math.floor(restaurant?.rating || 0))}
          </span>
          <span
            className={`text-gray-500 font-medium ml-1 ${
              isExpanded ? "text-sm" : "text-xs lg:text-xs"
            }`}
          >
            {Number(restaurant?.rating).toFixed(1)}
          </span>
        </div>
        <div
          className={`text-gray-600 bg-gray-50 px-2 py-1 rounded-full ${
            isExpanded ? "text-sm" : "text-xs lg:text-xs"
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
      <div className="flex-shrink-0 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-gray-500 ${isExpanded ? "text-sm" : "text-xs lg:text-xs"}`}
            >
              Price:
            </span>
            <span
              className={`text-green-600 font-medium ${
                isExpanded ? "text-base" : "text-sm"
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
                  ? "px-4 py-2 text-sm font-medium"
                  : "px-3 py-1.5 text-xs font-medium"
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

      {/* Contributed By Section - hidden on desktop in card layout */}
      {restaurant?.contributor_username && (
        <div className={`flex-shrink-0 mb-4 ${isExpanded ? "" : "lg:hidden"}`}>
          <div
            className={`flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 ${
              isExpanded ? "" : "mx-1"
            }`}
          >
            <div className="flex items-center gap-2 flex-1">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {restaurant.contributor_username?.charAt(0).toUpperCase() ||
                    "U"}
                </span>
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-gray-600 ${isExpanded ? "text-xs" : "text-xs"}`}
                >
                  Contributed by
                </span>
                <span
                  className={`font-medium text-gray-800 ${isExpanded ? "text-sm" : "text-xs"}`}
                >
                  @{restaurant.contributor_username}
                </span>
              </div>
            </div>
            <div className="text-purple-500">
              <svg
                className={`${isExpanded ? "w-5 h-5" : "w-4 h-4"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantInfo;
