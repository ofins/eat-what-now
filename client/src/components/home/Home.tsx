import { useEffect, useState } from "react";
import Feed from "./Feed";

const Home = () => {
  const [message, setMessage] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/events");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessage((prev) => [...prev, data.message]);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className=" w-full h-full flex flex-col justify-center items-center overflow-y-scroll">
      Home
      <span>Current time is {message.at(-1)}</span>
      <Feed />
    </div>
  );
};

export default Home;
