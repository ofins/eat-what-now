/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Feed from "./Feed";

export interface ILocation {
  latitude: number | null;
  longitude: number | null;
}

const Home = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  // const [message, setMessage] = useState<string[]>([]);
  const [location, setLocation] = useState<ILocation | null>({
    longitude: 121.5258039, // Default location (Taipei)
    latitude: 25.095147,
  });
  console.log({ isLoggedIn });

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  // todo: event source
  // useEffect(() => {
  //   const eventSource = new EventSource("http://localhost:3000/events");

  //   eventSource.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     setMessage((prev) => [...prev, data.message]);
  //   };

  //   eventSource.onerror = (error) => {
  //     console.error("EventSource failed:", error);
  //     eventSource.close();
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);

  console.log("Location:", location);

  return (
    <div id="Home" className="w-full flex flex-col items-center px-4">
      {/* <span className="font-[lobster] text-3xl py-3">EatWhatNow</span> */}
      <div className="py-3 mt-10">
        <Feed location={location} isLoggedIn={isLoggedIn} />
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
