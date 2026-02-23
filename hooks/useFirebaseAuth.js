"use client";

import { useEffect, useState } from "react";

export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Check localStorage for a mock user
    const mockUser = localStorage.getItem("mock_user");
    if (mockUser) {
      setUser(JSON.parse(mockUser));
    }
    setAuthReady(true);
  }, []);

  return { user, authReady };
};
