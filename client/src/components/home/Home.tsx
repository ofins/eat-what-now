/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import Feed from "./Feed";

export interface ILocation {
  latitude: number | null;
  longitude: number | null;
}

const Home = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div id="Home" className="w-full flex flex-col items-center px-4">
      {/* <span className="font-[lobster] text-3xl py-3">EatWhatNow</span> */}
      <div className="py-3 mt-10">
        <Feed isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
};

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const isLoggedIn = localStorage.getItem("token") !== null;

    useEffect(() => {
      if (isLoggedIn) {
        console.log("User is logged in");
      }
    }, [isLoggedIn]);

    return <WrappedComponent {...props} isLoggedIn={isLoggedIn} />;
  };
};

const homeWithAuth = withAuth(Home);
export default homeWithAuth;
