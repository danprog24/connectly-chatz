import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../api/autApi";
import { useAuthStore } from "../hooks/useAuthStore";

export const useLogin = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      // save token in Zustand + localStorage
      loginStore(data.token);

      // redirect (App will also react automatically)
      navigate("/");
    },

    onError: (error) => {
      console.error(error);
    },
  });
};