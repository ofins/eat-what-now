import React from "react";
import { PRESET_AVATARS } from "../hooks/useAvatar";

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAvatar: string | null;
  onSelectAvatar: (avatar: string | null) => void;
}

const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  selectedAvatar,
  onSelectAvatar,
}) => {
  if (!isOpen) return null;

  const handleAvatarSelect = (avatar: string) => {
    onSelectAvatar(avatar);
    onClose();
  };

  const handleReset = () => {
    onSelectAvatar(null);
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1) translateY(0); }
          25% { transform: scale(1.05) translateY(-2px); }
          50% { transform: scale(1.1) translateY(-4px); }
          75% { transform: scale(1.05) translateY(-2px); }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
          onClick={onClose}
        />

        {/* Modal - Responsive */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-sm md:max-w-md w-full mx-4 transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
          {/* Header - Responsive */}
          <div className="text-center mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">
              Choose Your Avatar
            </h3>
            <p className="text-gray-600 text-xs md:text-sm">
              Select a pixel avatar to represent you
            </p>
          </div>

          {/* Avatar Grid - Responsive */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-6">
            {PRESET_AVATARS.map((avatar, index) => (
              <button
                key={index}
                onClick={() => handleAvatarSelect(avatar)}
                className="group relative w-full h-20 md:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-red-300 transition-all duration-200 flex items-center justify-center hover:scale-101 hover:shadow-lg transform active:scale-95 cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.animation = "bounce 0.6s ease-in-out";
                }}
                onAnimationEnd={(e) => {
                  e.currentTarget.style.animation = "";
                }}
              >
                <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-200">
                  {avatar}
                </span>

                {/* Selection indicator */}
                {selectedAvatar === avatar && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 md:w-3 md:h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Actions - Responsive */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            <button
              onClick={onClose}
              className="w-full md:flex-1 px-4 py-2.5 md:py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="w-full md:flex-1 px-4 py-2.5 md:py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors text-sm md:text-base"
            >
              Reset to Initial
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default AvatarModal;
