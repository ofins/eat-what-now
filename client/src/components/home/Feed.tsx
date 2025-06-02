import { useQuery } from "@tanstack/react-query";
import type { IRestaurant } from "../../../../shared/types/restaurants.type";

// type FeedItem = {
//   id: string | number;
//   title: string;
//   name: string;
//   address: string;
// };

type FeedResponse = {
  data: IRestaurant[];
};

const Feed = () => {
  const { data, isLoading, error } = useQuery<FeedResponse>({
    queryKey: ["feed"], // Path matches API endpoint
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ul>
        {data?.data.map((r) => {
          return (
            <li key={r.name} className="p-2 m-2 border rounded">
              <h3 className="text-lg font-bold">{r.name}</h3>
              <p>{r.name}</p>
              <span className="text-sm text-gray-500">
                location:{r.address}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Feed;
