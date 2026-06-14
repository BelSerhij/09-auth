"use client";

import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );
  const loading = useAuthStore((state) => state.isLoading);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const isAuthenticated = await checkSession();

        if (isAuthenticated) {
          const user = await getMe();

          if (user) {
            setUser(user);
          }
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser, clearIsAuthenticated, setLoading]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return <>{children} </>;
};

export default AuthProvider;