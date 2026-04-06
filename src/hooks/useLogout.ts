import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/autApi";
import { useAuthStore } from "./useAuthStore";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const auth = useAuthStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.clear();
      navigate("/login");
    },
    onError: () => {
      localStorage.removeItem("token");
      auth.logout();
      navigate("/auth/login");
    },
  });
};