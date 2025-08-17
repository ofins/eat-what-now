import { createAuth } from "@ofins/client";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const auth = createAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(auth.getAuthState());

  useEffect(() => {
    const unsubscribe = auth.subscribe((loggedIn) => {
      setIsLoggedIn(loggedIn);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [auth]);

  return {
    isLoggedIn,
    login: (token: string) => auth.login(token),
    logout: () => auth.logout(),
  };
};
