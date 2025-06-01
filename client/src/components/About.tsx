import { useQuery } from "@tanstack/react-query";

type UserProfileResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

const About = () => {
  const { data, isLoading, error } = useQuery<UserProfileResponse>({
    queryKey: ["users/profile"], // Path matches API endpoint
  });

  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      Profile:
      <ul>
        <li>Full name: {data?.data.full_name}</li>
        <li>Email: {data?.data.email}</li>
        <li>Active: {data?.data.is_active ? "yes" : "no"}</li>
        <li>Verified: {data?.data.is_verified ? "yes" : "no"}</li>
      </ul>
    </div>
  );
};

export default About;
