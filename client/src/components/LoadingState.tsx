import React from "react";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading your profile...",
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-4xl">
        <div className="text-center text-gray-600 text-sm">{message}</div>
      </div>
    </div>
  );
};

export default LoadingState;
