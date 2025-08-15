import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { isLoggedIn } = useAuth();

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 
                     border-b border-gray-200 h-10"
    >
      <div className="flex items-center justify-between px-4 h-full">
        {/* Left side - Toggle button and Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-1 rounded-lg hover:bg-gray-100 
                     transition-colors duration-200 cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 18H21"
                stroke="#EF2A39"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 12H21"
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

          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 
                     transition-opacity"
          >
            <img
              src="/pixel-burger.png"
              alt="Eat What Now"
              className="w-8 h-8"
            />
            <span className="font-bold text-[#EF2A39] text-lg hidden sm:block">
              Eat What Now
            </span>
          </Link>
        </div>

        {/* Right side - Search link (only when logged in) */}
        {isLoggedIn && (
          <div className="flex items-center">
            <Link
              to="/search"
              className="flex items-center space-x-2 px-3 py-2 
                       text-gray-700 hover:text-[#EF2A39] 
                       hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-[#EF2A39] sm:hidden"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <img
                src="/search.svg"
                alt="Search"
                className="w-5 h-5 hidden sm:block"
              />
              <span className="font-medium hidden sm:block">Search</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
