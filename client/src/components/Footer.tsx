import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Footer = () => {
  const { isLoggedIn } = useAuth();

  return (
    <footer className="fixed bottom-0 bg-[#EF2A39] w-full flex px-6 py-4 text-white z-[3] gap-15 pointer-events-auto">
      <div className="flex-1 flex justify-start gap-15">
        <Link to="/">
          <img src="/home.svg" />
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/about">
              <img src="/profile.svg" />
            </Link>
            <Link to="/search">
              <img src="/search.svg" />
            </Link>
          </>
        ) : null}
      </div>
      <div className="flex-1 flex justify-end gap-15">
        {!isLoggedIn ? (
          <Link to="/login">
            <img src="/login.svg" />
          </Link>
        ) : (
          <img
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            src="/logout.svg"
          />
        )}
      </div>
    </footer>
  );
};

export default Footer;
