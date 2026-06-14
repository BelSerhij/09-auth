import { create } from "zustand";
import type { User } from "@/types/user";

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  setLoading: (value: boolean) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isLoading: false,
      isAuthenticated: true,
    }),

  setLoading: (value) =>
    set({
      isLoading: value,
    }),

  clearIsAuthenticated: () =>
    set({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    }),
}));