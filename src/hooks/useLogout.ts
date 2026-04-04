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
      //  clear everything
      localStorage.removeItem("token");

      // clear cache (important)
      queryClient.clear();

      // redirect
      navigate("/login");
    },
    onError: () => {
      // even if backend fails, force logout
      localStorage.removeItem("token");
      auth.setToken(null);
      navigate("/login");
    },
  });
};