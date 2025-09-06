/* eslint-disable @typescript-eslint/no-explicit-any */
import Feed from "./Feed";

export interface ILocation {
  latitude: number | null;
  longitude: number | null;
}

const Home = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <div id="Home" className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-1 px-2 py-2">
        <Feed isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
};

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const isLoggedIn = localStorage.getItem("token") !== null;
    return <WrappedComponent {...props} isLoggedIn={isLoggedIn} />;
  };
};

const homeWithAuth = withAuth(Home);
export default homeWithAuth;
