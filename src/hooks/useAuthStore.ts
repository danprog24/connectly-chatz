import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  sub: string;
  userId: string;
  iat: number;
  exp: number;
}

interface AuthState {
  token: string | null;
  username: string | null;
  avatar: string | null;
  userId: string | null;
  login: (tokenValue: string) => void;
  logout: () => void;
  setAvatar: (url: string) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode<TokenPayload>(token) : null;

  return {
    token,
    username: decoded?.sub ?? null,
    userId: decoded?.userId ?? null,
    avatar: null, // ✅ initialize to null

    login: (tokenValue: string) =>
      set(() => {
        localStorage.setItem("token", tokenValue);
        const decoded = jwtDecode<TokenPayload>(tokenValue);
        return {
          token: tokenValue,
          username: decoded.sub,
          userId: decoded.userId,
          avatar: null, // ✅ reset avatar on login, App.tsx will fetch it
        };
      }),

    logout: () =>
      set(() => {
        localStorage.removeItem("token");
        return { token: null, username: null, userId: null, avatar: null }; // ✅ clear avatar on logout
      }),

    setAvatar: (url: string) => set({ avatar: url }),
  };
});