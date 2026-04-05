import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import HomePage from "./component/pages/HomePage";
import ChatPage from "./component/pages/ChatPage";
import ProfilePage from "./component/pages/ProfilePage";
import ProtectedRoute from "./component/ProtectedRoute";
import PublicRoute from "./component/PublicRoute";
import Login from "./component/pages/Login";
import { api } from "./api/axios";
import { useAuthStore } from "./hooks/useAuthStore";
import { WebSocketProvider } from "./component/WebSocketContext";
import RegisterPage from "./component/pages/Register";

const App: React.FC = () => {
  const username = useAuthStore((state) => state.username);
  const setAvatar = useAuthStore((state) => state.setAvatar);

  useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const res = await api.get(`/api/users/profile/${username}`);
      if (res.data.avatar) setAvatar(res.data.avatar);
      return res.data;
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });



  return (
    // WebSocketProvider wraps Routes, not inside it
    <WebSocketProvider >
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </WebSocketProvider>
  );
};

export default App;