import { useEffect, useState } from "react";
import Feed from "./Feed";

interface ILocation {
  latitude: number | null;
  longitude: number | null;
}

const Home = () => {
  // const [message, setMessage] = useState<string[]>([]);
  const [location, setLocation] = useState<ILocation | null>(null);

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
    <div
      id="Home"
      className="w-full h-full flex flex-col justify-center items-center overflow-y-scroll"
    >
      <span className="font-[lobster] text-2xl">EatWhatNow</span>
      <Feed />
    </div>
  );
};

export default Home;
