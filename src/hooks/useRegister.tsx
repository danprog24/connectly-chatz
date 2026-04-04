import { useMutation } from "@tanstack/react-query";
import { api } from "../api/axios";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await api.post("/auth/register", data);
      return response.data;
    },
  });
};