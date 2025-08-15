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
          <span
            className={`text-yellow-500 ${isExpanded ? "text-xs" : "text-xs lg:text-xs"}`}
          >
            {"★".repeat(Math.floor(restaurant?.rating || 0))}
            {"☆".repeat(5 - Math.floor(restaurant?.rating || 0))}
          </span>
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
    </>
  );
};

export default RestaurantInfo;
