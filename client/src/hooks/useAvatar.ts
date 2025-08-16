import { useEffect, useState } from "react";

const AVATAR_STORAGE_KEY = "user-avatar";

export const PRESET_AVATARS = [
  "🧑‍💼", // Business person
  "👩‍🍳", // Chef
  "🧑‍🎨", // Artist
  "👨‍💻", // Developer
];

export const useAvatar = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // Load avatar from localStorage on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (savedAvatar && PRESET_AVATARS.includes(savedAvatar)) {
      setSelectedAvatar(savedAvatar);
    }
  }, []);

  // Save avatar to localStorage when it changes
  const saveAvatar = (avatar: string | null) => {
    setSelectedAvatar(avatar);
    if (avatar) {
      localStorage.setItem(AVATAR_STORAGE_KEY, avatar);
    } else {
      localStorage.removeItem(AVATAR_STORAGE_KEY);
    }
  };

  const resetAvatar = () => {
    setSelectedAvatar(null);
    localStorage.removeItem(AVATAR_STORAGE_KEY);
  };

  return {
    selectedAvatar,
    saveAvatar,
    resetAvatar,
  };
};
