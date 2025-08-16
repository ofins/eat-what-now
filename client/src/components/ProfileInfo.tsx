import React from "react";

interface ProfileInfoProps {
  fullName?: string;
  email?: string;
  memberSince: string;
  isActive?: boolean;
  isVerified?: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  fullName,
  email,
  memberSince,
  isActive,
  isVerified,
}) => {
  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <div>
        <h3 className="text-gray-800 text-sm font-semibold mb-2 pb-1 border-b-2 border-red-500 inline-block">
          Personal Information
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium text-xs">Full Name</span>
            <span className="text-gray-900 text-xs">
              {fullName || "Not provided"}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium text-xs">Email</span>
            <span className="text-gray-900 text-xs">
              {email || "Not provided"}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium text-xs">
              Member Since
            </span>
            <span className="text-gray-900 text-xs">{memberSince}</span>
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
                isActive
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-gray-700 font-medium text-xs">
              Email Verified
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                isVerified
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : "bg-yellow-100 text-yellow-800 border border-yellow-200"
              }`}
            >
              {isVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
