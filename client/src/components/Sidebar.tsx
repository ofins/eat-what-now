import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  onCloseExpanded?: () => void;
}

const Sidebar = ({
  isOpen,
  onClose,
  isExpanded = false,
  onToggleExpanded,
  onCloseExpanded,
}: SidebarProps) => {
  const { isLoggedIn } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "hidden"; // Keep overflow hidden since we don't want scrolling
    }

    return () => {
      document.body.style.overflow = "hidden";
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
    onClose();
  };

  return (
    <>
      {/* Overlay - show on mobile when open, or desktop when expanded (but not over sidebar) */}
      <div
        className={`fixed transition-all duration-500 ease-out z-40 ${
          isOpen && !isExpanded
            ? "inset-0 bg-black opacity-50 visible lg:hidden"
            : isExpanded
              ? "inset-0 lg:left-80 bg-black opacity-50 visible"
              : "inset-0 bg-black opacity-0 invisible"
        }`}
        onClick={isExpanded ? onCloseExpanded : onClose}
      ></div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed lg:static top-0 left-0 h-full bg-white shadow-xl z-50 
                   transform transition-all duration-500 ease-out lg:transition-all lg:duration-300
                   ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
                   flex flex-col overflow-hidden
                   ${
                     isExpanded
                       ? "lg:fixed lg:w-80 lg:z-50 lg:translate-x-0"
                       : "w-full sm:w-20 lg:w-20 lg:-translate-x-0"
                   }`}
      >
        {/* Logo area */}
        <div
          className={`px-6 py-4 border-b border-gray-100 flex items-center ${
            isExpanded ? "justify-between" : "justify-between lg:justify-center"
          }`}
        >
          <div
            className={`flex items-center ${
              isExpanded ? "" : "lg:flex-col lg:text-center"
            }`}
          >
            <img
              src="/pixel-burger.png"
              alt="Logo"
              className={`w-10 h-10 ${
                isExpanded ? "mr-3" : "lg:w-8 lg:h-8 mr-3 lg:mr-0 lg:mb-2"
              }`}
            />
            <div className={isExpanded ? "" : "lg:hidden"}>
              <div className="text-xl font-bold text-[#EF2A39]">
                Eat What Now
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Find your next meal
              </div>
            </div>
          </div>

          {/* Desktop toggle button (only visible on desktop, not expanded) */}
          {!isExpanded && (
            <button
              onClick={onToggleExpanded}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Expand sidebar"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12H21"
                  stroke="#EF2A39"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 18H21"
                  stroke="#EF2A39"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 6H21"
                  stroke="#EF2A39"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Back arrow button - mobile or desktop expanded */}
          {(isExpanded || !isExpanded) && (
            <button
              onClick={isExpanded ? onCloseExpanded : onClose}
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                isExpanded ? "" : "lg:hidden"
              }`}
              aria-label="Close sidebar"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#EF2A39"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation links */}
        <nav
          className={`flex-grow py-6 overflow-y-auto ${
            isExpanded ? "px-4" : "px-4 lg:px-2"
          }`}
        >
          <div
            className={`mb-4 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider ${
              isExpanded ? "" : "lg:hidden"
            }`}
          >
            Menu
          </div>
          <ul className={`space-y-1 ${isExpanded ? "" : "lg:space-y-3"}`}>
            <li>
              <Link
                to="/"
                className={`flex items-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                  isExpanded
                    ? "px-4 py-3"
                    : "px-4 lg:px-2 py-3 lg:py-2 lg:flex-col lg:text-center"
                }`}
                onClick={isExpanded ? onCloseExpanded : onClose}
              >
                <div
                  className={`bg-blue-100 rounded-lg flex items-center justify-center ${
                    isExpanded
                      ? "w-8 h-8 mr-3"
                      : "w-8 h-8 lg:w-6 lg:h-6 mr-3 lg:mr-0 lg:mb-1"
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    className={isExpanded ? "" : "lg:w-4 lg:h-4"}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 22V12H15V22"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span
                  className={`font-medium ${
                    isExpanded ? "" : "lg:text-xs lg:font-normal"
                  }`}
                >
                  Home
                </span>
              </Link>
            </li>

            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/search"
                    className={`flex items-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                      isExpanded
                        ? "px-4 py-3"
                        : "px-4 lg:px-2 py-3 lg:py-2 lg:flex-col lg:text-center"
                    }`}
                    onClick={isExpanded ? onCloseExpanded : onClose}
                  >
                    <div
                      className={`bg-green-100 rounded-lg flex items-center justify-center ${
                        isExpanded
                          ? "w-8 h-8 mr-3"
                          : "w-8 h-8 lg:w-6 lg:h-6 mr-3 lg:mr-0 lg:mb-1"
                      }`}
                    >
                      <svg
                        width="16"
                        height="16"
                        className={isExpanded ? "" : "lg:w-4 lg:h-4"}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="11"
                          cy="11"
                          r="8"
                          stroke="#10B981"
                          strokeWidth="2"
                        />
                        <path
                          d="M21 21L16.65 16.65"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span
                      className={`font-medium ${
                        isExpanded ? "" : "lg:text-xs lg:font-normal"
                      }`}
                    >
                      Search
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className={`flex items-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                      isExpanded
                        ? "px-4 py-3"
                        : "px-4 lg:px-2 py-3 lg:py-2 lg:flex-col lg:text-center"
                    }`}
                    onClick={isExpanded ? onCloseExpanded : onClose}
                  >
                    <div
                      className={`bg-purple-100 rounded-lg flex items-center justify-center ${
                        isExpanded
                          ? "w-8 h-8 mr-3"
                          : "w-8 h-8 lg:w-6 lg:h-6 mr-3 lg:mr-0 lg:mb-1"
                      }`}
                    >
                      <svg
                        width="16"
                        height="16"
                        className={isExpanded ? "" : "lg:w-4 lg:h-4"}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                          stroke="#8B5CF6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="7"
                          r="4"
                          stroke="#8B5CF6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span
                      className={`font-medium ${
                        isExpanded ? "" : "lg:text-xs lg:font-normal"
                      }`}
                    >
                      Profile
                    </span>
                  </Link>
                </li>

                <div
                  className={`my-4 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                    isExpanded ? "" : "lg:hidden"
                  }`}
                >
                  Account
                </div>
                <li>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full text-left ${
                      isExpanded
                        ? "px-4 py-3"
                        : "px-4 lg:px-2 py-3 lg:py-2 lg:flex-col lg:text-center"
                    }`}
                  >
                    <div
                      className={`bg-red-100 rounded-lg flex items-center justify-center ${
                        isExpanded
                          ? "w-8 h-8 mr-3"
                          : "w-8 h-8 lg:w-6 lg:h-6 mr-3 lg:mr-0 lg:mb-1"
                      }`}
                    >
                      <svg
                        width="16"
                        height="16"
                        className={isExpanded ? "" : "lg:w-4 lg:h-4"}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                          stroke="#EF4444"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 17L21 12L16 7"
                          stroke="#EF4444"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 12H9"
                          stroke="#EF4444"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span
                      className={`font-medium ${
                        isExpanded ? "" : "lg:text-xs lg:font-normal"
                      }`}
                    >
                      Logout
                    </span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <div
                  className={`my-4 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                    isExpanded ? "" : "lg:hidden"
                  }`}
                >
                  Account
                </div>
                <li>
                  <Link
                    to="/login"
                    onClick={isExpanded ? onCloseExpanded : onClose}
                    className={`flex items-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                      isExpanded
                        ? "px-4 py-3"
                        : "px-4 lg:px-2 py-3 lg:py-2 lg:flex-col lg:text-center"
                    }`}
                  >
                    <div
                      className={`bg-blue-100 rounded-lg flex items-center justify-center ${
                        isExpanded
                          ? "w-8 h-8 mr-3"
                          : "w-8 h-8 lg:w-6 lg:h-6 mr-3 lg:mr-0 lg:mb-1"
                      }`}
                    >
                      <svg
                        width="16"
                        height="16"
                        className={isExpanded ? "" : "lg:w-4 lg:h-4"}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
                          stroke="#3B82F6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 17L15 12L10 7"
                          stroke="#3B82F6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15 12H3"
                          stroke="#3B82F6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span
                      className={`font-medium ${
                        isExpanded ? "" : "lg:text-xs lg:font-normal"
                      }`}
                    >
                      Login
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    onClick={isExpanded ? onCloseExpanded : onClose}
                    className={`flex items-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                      isExpanded
                        ? "px-4 py-3"
                        : "px-4 lg:px-2 py-3 lg:py-2 lg:flex-col lg:text-center"
                    }`}
                  >
                    <div
                      className={`bg-green-100 rounded-lg flex items-center justify-center ${
                        isExpanded
                          ? "w-8 h-8 mr-3"
                          : "w-8 h-8 lg:w-6 lg:h-6 mr-3 lg:mr-0 lg:mb-1"
                      }`}
                    >
                      <svg
                        width="16"
                        height="16"
                        className={isExpanded ? "" : "lg:w-4 lg:h-4"}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="8.5"
                          cy="7"
                          r="4"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20 8V14"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M23 11H17"
                          stroke="#10B981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span
                      className={`font-medium ${
                        isExpanded ? "" : "lg:text-xs lg:font-normal"
                      }`}
                    >
                      Register
                    </span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Bottom section - hidden when icon-only mode */}
        <div
          className={`px-6 py-6 border-t border-gray-100 ${
            isExpanded ? "" : "lg:hidden"
          }`}
        >
          {isLoggedIn ? (
            <div className="flex items-center bg-gray-50 rounded-lg p-4">
              <img
                src="/profile.svg"
                alt="Profile"
                className="w-10 h-10 bg-gray-200 p-2 rounded-full"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  Logged in
                </div>
                <div className="text-xs text-gray-500">
                  You're currently logged in
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                onClick={onClose}
                className="block w-full bg-[#EF2A39] text-white text-center py-3 rounded-lg hover:bg-red-600 transition-colors shadow-sm font-medium"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="block w-full bg-white border border-[#EF2A39] text-[#EF2A39] text-center py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>© 2025 Eat What Now. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
