import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAvatar } from "../hooks/useAvatar";
import AvatarModal from "./AvatarModal";
import AvatarSection from "./AvatarSection";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import MobileProfileLayout from "./MobileProfileLayout";
import ProfileInfo from "./ProfileInfo";

export type UserProfileResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

const About = () => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const { selectedAvatar, saveAvatar } = useAvatar();

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

  const handleAvatarSelect = (avatar: string | null) => {
    saveAvatar(avatar);
    setIsAvatarModalOpen(false);
  };

  const memberSince = formatMemberSince(data?.data.created_at);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl overflow-hidden">
        {/* Desktop Layout - 16:9 aspect ratio */}
        <div className="hidden lg:block">
          <div className="aspect-video flex">
            {/* Avatar Section - Left side */}
            <AvatarSection
              selectedAvatar={selectedAvatar}
              fullName={data?.data.full_name}
              email={data?.data.email}
              memberSince={memberSince}
              onEditClick={() => setIsAvatarModalOpen(true)}
            />

            {/* Content Section - Right side */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              <ProfileInfo
                fullName={data?.data.full_name}
                email={data?.data.email}
                memberSince={memberSince}
                isActive={data?.data.is_active}
                isVerified={data?.data.is_verified}
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <MobileProfileLayout
            selectedAvatar={selectedAvatar}
            fullName={data?.data.full_name}
            email={data?.data.email}
            memberSince={memberSince}
            isActive={data?.data.is_active}
            isVerified={data?.data.is_verified}
            onEditAvatarClick={() => setIsAvatarModalOpen(true)}
          />
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        selectedAvatar={selectedAvatar}
        onSelectAvatar={handleAvatarSelect}
      />
    </div>
  );
};

export default About;
