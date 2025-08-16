import React from "react";

interface AvatarSectionProps {
  selectedAvatar: string | null;
  fullName?: string;
  email?: string;
  memberSince: string;
  onEditClick: () => void;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({
  selectedAvatar,
  fullName,
  email,
  memberSince,
  onEditClick,
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
    <div className="w-1/3 bg-gradient-to-br from-red-500 to-red-600 p-6 flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
        <span className="text-xl font-bold text-red-500">
          {getDisplayAvatar()}
        </span>
      </div>

      {/* Edit Avatar Button */}
      <button
        onClick={onEditClick}
        className="mb-3 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-1 cursor-pointer"
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

      <h2 className="text-white text-base font-semibold text-center mb-1">
        {fullName || "User Profile"}
      </h2>
      <p className="text-red-100 text-xs text-center opacity-90 mb-2">
        Account Information
      </p>
      <p className="text-red-100 text-xs text-center opacity-80">
        Member since {memberSince}
      </p>
    </div>
  );
};

export default AvatarSection;
