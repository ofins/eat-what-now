/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import Feed from "./Feed";

export interface ILocation {
  latitude: number | null;
  longitude: number | null;
}

const Home = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div id="Home" className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-1 px-4 py-4">
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
