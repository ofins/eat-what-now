import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ${isOpen ? "bg-white" : "bg-[#EF2A39]"}`}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className="block h-0.5 w-full bg-[#EF2A39] transition-all duration-300 rotate-45 translate-y-2"></span>
            <span className="block h-0.5 w-full bg-[#EF2A39] transition-all duration-300 opacity-0"></span>
            <span className="block h-0.5 w-full bg-[#EF2A39] transition-all duration-300 -rotate-45 -translate-y-2"></span>
          </div>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 18H21"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 12H21"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 6H21"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col overflow-hidden`}
      >
        {/* Logo area */}
        <div className="px-6 py-8 border-b border-gray-100 flex items-center">
          <img src="/pixel-burger.png" alt="Logo" className="w-10 h-10 mr-3" />
          <div>
            <div className="text-xl font-bold text-[#EF2A39]">Eat What Now</div>
            <div className="text-xs text-gray-500 mt-0.5">
              Find your next meal
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-grow py-6 px-4 overflow-y-auto">
          <div className="mb-4 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </div>
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                className="flex items-center text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <img src="/home.svg" alt="Home" className="w-5 h-5 mr-3" />
                <span className="font-medium">Home</span>
              </Link>
            </li>

            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/search"
                    className="flex items-center text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <img
                      src="/search.svg"
                      alt="Search"
                      className="w-5 h-5 mr-3"
                    />
                    <span className="font-medium">Search Restaurants</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="flex items-center text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <img
                      src="/profile.svg"
                      alt="Profile"
                      className="w-5 h-5 mr-3"
                    />
                    <span className="font-medium">Profile</span>
                  </Link>
                </li>

                <div className="my-4 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Account
                </div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors w-full text-left"
                  >
                    <img
                      src="/logout.svg"
                      alt="Logout"
                      className="w-5 h-5 mr-3"
                    />
                    <span className="font-medium">Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <div className="my-4 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Account
                </div>
                <li>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors"
                  >
                    <img
                      src="/login.svg"
                      alt="Login"
                      className="w-5 h-5 mr-3"
                    />
                    <span className="font-medium">Log In</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors"
                  >
                    <span className="w-5 h-5 mr-3 flex items-center justify-center bg-[#EF2A39] rounded-full text-white text-xs">
                      +
                    </span>
                    <span className="font-medium">Sign Up</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="px-6 py-6 border-t border-gray-100">
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
                onClick={() => setIsOpen(false)}
                className="block w-full bg-[#EF2A39] text-white text-center py-3 rounded-lg hover:bg-red-600 transition-colors shadow-sm font-medium"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
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

        {/* Mobile quick-access menu */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 flex justify-around items-center py-3 px-2 z-40">
          <Link
            to="/"
            className="flex flex-col items-center text-gray-700 hover:text-[#EF2A39] transition-colors px-2"
          >
            <img src="/home.svg" alt="Home" className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/search"
                className="flex flex-col items-center text-gray-700 hover:text-[#EF2A39] transition-colors px-2"
              >
                <img src="/search.svg" alt="Search" className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Search</span>
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="flex flex-col items-center text-[#EF2A39] transition-colors relative px-2"
              >
                <div className="w-12 h-12 bg-[#EF2A39] rounded-full flex items-center justify-center -mt-6 shadow-lg">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 18H21"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 12H21"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 6H21"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium mt-1">More</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex flex-col items-center text-gray-700 hover:text-[#EF2A39] transition-colors px-2"
              >
                <img src="/login.svg" alt="Login" className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Login</span>
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="flex flex-col items-center text-[#EF2A39] transition-colors relative px-2"
              >
                <div className="w-12 h-12 bg-[#EF2A39] rounded-full flex items-center justify-center -mt-6 shadow-lg">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 18H21"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 12H21"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 6H21"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium mt-1">More</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
