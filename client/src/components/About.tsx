import { useQuery } from "@tanstack/react-query";

export type UserProfileResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

const About = () => {
  const { data, isLoading, error } = useQuery<UserProfileResponse>({
    queryKey: ["users/profile"], // Path matches API endpoint
  });

  // Helper function to format date
  const formatMemberSince = (dateString: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-4xl">
          <div className="text-center text-gray-600 text-sm">
            Loading your profile...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-4xl">
          <div className="text-center text-red-600 text-sm">
            Unable to load profile data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl overflow-hidden">
        {/* Desktop Layout - 16:9 aspect ratio */}
        <div className="hidden lg:block">
          <div className="aspect-video flex">
            {/* Avatar Section - Left side */}
            <div className="w-1/3 bg-gradient-to-br from-red-500 to-red-600 p-6 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                <span className="text-xl font-bold text-red-500">
                  {data?.data.full_name?.charAt(0)?.toUpperCase() ||
                    data?.data.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </span>
              </div>
              <h2 className="text-white text-base font-semibold text-center mb-1">
                {data?.data.full_name || "User Profile"}
              </h2>
              <p className="text-red-100 text-xs text-center opacity-90 mb-2">
                Account Information
              </p>
              <p className="text-red-100 text-xs text-center opacity-80">
                Member since {formatMemberSince(data?.data.created_at)}
              </p>
            </div>

            {/* Content Section - Right side */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="space-y-4">
                {/* Personal Information */}
                <div>
                  <h3 className="text-gray-800 text-sm font-semibold mb-2 pb-1 border-b-2 border-red-500 inline-block">
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-700 font-medium text-xs">
                        Full Name
                      </span>
                      <span className="text-gray-900 text-xs">
                        {data?.data.full_name || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-700 font-medium text-xs">
                        Email
                      </span>
                      <span className="text-gray-900 text-xs">
                        {data?.data.email || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-700 font-medium text-xs">
                        Member Since
                      </span>
                      <span className="text-gray-900 text-xs">
                        {formatMemberSince(data?.data.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div>
                  <h3 className="text-gray-800 text-sm font-semibold mb-2 pb-1 border-b-2 border-red-500 inline-block">
                    Account Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-700 font-medium text-xs">
                        Account Status
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          data?.data.is_active
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {data?.data.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-700 font-medium text-xs">
                        Email Verified
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          data?.data.is_verified
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        {data?.data.is_verified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - No avatar, more compact */}
        <div className="lg:hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 text-center">
            <h2 className="text-white text-base font-semibold mb-0.5">
              Your Profile
            </h2>
            <p className="text-red-100 text-xs opacity-90">
              Member since {formatMemberSince(data?.data.created_at)}
            </p>
          </div>

          {/* Content - Single column, compact */}
          <div className="p-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="space-y-2">
                {/* Personal Information - Inline */}
                <div>
                  <h3 className="text-gray-800 text-sm font-semibold mb-2 pb-1 border-b-2 border-red-500 inline-block">
                    Personal Information
                  </h3>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="text-gray-700 font-medium text-xs">
                        Full Name
                      </span>
                      <span className="text-gray-900 text-xs">
                        {data?.data.full_name || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="text-gray-700 font-medium text-xs">
                        Email
                      </span>
                      <span className="text-gray-900 text-xs">
                        {data?.data.email || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Status - Inline */}
                <div className="pt-2">
                  <h3 className="text-gray-800 text-sm font-semibold mb-2 pb-1 border-b-2 border-red-500 inline-block">
                    Account Status
                  </h3>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="text-gray-700 font-medium text-xs">
                        Status
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          data?.data.is_active
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {data?.data.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="text-gray-700 font-medium text-xs">
                        Email Verified
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          data?.data.is_verified
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        {data?.data.is_verified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
