import React, { useCallback, useEffect, useState } from "react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = useCallback(() => {
    if (dontShowAgain) {
      localStorage.setItem("dontShowWelcomeModal", "true");
    }
    onClose();
  }, [dontShowAgain, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Blurred backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 
                   md:aspect-[16/9] max-md:min-h-[80vh] max-md:max-h-[80vh] max-md:overflow-y-auto md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable content */}
        <div className="h-full overflow-y-auto rounded-2xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="p-6 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Welcome to Eat What Now! 🍽️
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
            </div>

            {/* Content */}
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-6 rounded-xl border border-orange-100">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                  🚀 About This Project
                </h2>
                <p className="text-sm md:text-sm">
                  This site helps you discover and share your favorite
                  restaurants by leveraging the power of community
                  contributions. EatWhatNow is an{" "}
                  <strong>open-source project</strong> created by{" "}
                  <span className="font-medium text-orange-600">ofins</span> and
                  all restaurants are contributed by users like you.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 rounded-xl border border-blue-100">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                  👥 Community Driven
                </h2>
                <p className="text-sm md:text-sm">
                  All restaurants on this platform are{" "}
                  <strong>contributed by real users</strong> like you! Every
                  recommendation comes from genuine experiences shared by our
                  community members.
                </p>
              </div>

              {/* <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 rounded-xl border border-green-100">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                  💚 Non-Profit Initiative
                </h2>
                <p className="text-sm md:text-sm">
                  This is a <strong>100% non-profit project</strong>. We're not
                  here to make money – we're here to help you discover amazing
                  food experiences and build a community of food lovers.
                </p>
              </div> */}

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 md:p-6 rounded-xl border border-purple-100">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                  🎮 Future Features
                </h2>
                <p className="mb-4 text-sm md:text-sm">
                  Your contributions matter! We're working on exciting{" "}
                  <strong>game-like mechanisms</strong> to make discovering and
                  sharing restaurants even more fun:
                </p>
                <ul className="list-disc list-inside space-y-1 md:space-y-2 ml-4 text-xs md:text-xs">
                  <li>
                    ⭐ <strong>User levels</strong> based on contributions
                  </li>
                  <li>
                    🔰 <strong>Achievement badges</strong> for different
                    milestones
                  </li>
                  <li>
                    🥠 <strong>Community challenges</strong> and food quests
                  </li>
                  <li>
                    🏆 <strong>Leaderboards</strong> for top contributors
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 md:p-6 rounded-xl border border-yellow-100">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                  🌟 Get Started
                </h2>
                <p className="text-sm md:text-sm">
                  Ready to explore? Start by browsing restaurants! Sign-in to
                  add your favorites, or contribute new discoveries to help
                  fellow food enthusiasts. Every review, rating, and
                  recommendation helps build our community!
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="dontShowAgain"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <label
                    htmlFor="dontShowAgain"
                    className="text-sm text-gray-600 cursor-pointer select-none"
                  >
                    Don't show this again
                  </label>
                </div>

                <button
                  onClick={handleClose}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                  Let's Get Started! 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
