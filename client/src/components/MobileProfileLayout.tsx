import React from "react";

interface MobileProfileLayoutProps {
  selectedAvatar?: string | null;
  fullName?: string;
  email?: string;
  memberSince: string;
  isActive?: boolean;
  isVerified?: boolean;
  onEditAvatarClick?: () => void;
}

const MobileProfileLayout: React.FC<MobileProfileLayoutProps> = ({
  selectedAvatar,
  fullName,
  email,
  memberSince,
  isActive,
  isVerified,
  onEditAvatarClick,
}) => {
  const getDisplayAvatar = () => {
    if (selectedAvatar) return selectedAvatar;
    return (
      fullName?.charAt(0)?.toUpperCase() ||
      email?.charAt(0)?.toUpperCase() ||
      "U"
    );
  };
  return (
    <div className="lg:hidden">
      {/* Header with Avatar */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 text-center">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-3">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-lg">
            <span className="text-lg font-bold text-red-500">
              {getDisplayAvatar()}
            </span>
          </div>

          {/* Edit Avatar Button */}
          {onEditAvatarClick && (
            <button
              onClick={onEditAvatarClick}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-1"
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit Avatar
            </button>
          )}
        </div>

        <h2 className="text-white text-base font-semibold mb-0.5">
          Your Profile
        </h2>
        <p className="text-red-100 text-xs opacity-90">
          Member since {memberSince}
        </p>
      </div>

      {/* Content - Single column, compact */}
      <div className="p-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="space-y-2">
            {/* Personal Information - Inline */}
            <div>
              <h3 className="text-gray-800 text-sm font-semibold mb-2 pb-1 border-b-2 border-red-500 inline-block">
                Personal Information
              </h3>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-gray-700 font-medium text-xs">
                    Full Name
                  </span>
                  <span className="text-gray-900 text-xs">
                    {fullName || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-gray-700 font-medium text-xs">
                    Email
                  </span>
                  <span className="text-gray-900 text-xs">
                    {email || "Not provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Status - Inline */}
            <div className="pt-2">
              <h3 className="text-gray-800 text-sm font-semibold mb-2 pb-1 border-b-2 border-red-500 inline-block">
                Account Status
              </h3>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-gray-700 font-medium text-xs">
                    Status
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isActive
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-gray-700 font-medium text-xs">
                    Email Verified
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isVerified
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    }`}
                  >
                    {isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileProfileLayout;
