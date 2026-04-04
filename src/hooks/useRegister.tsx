import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await axios.post("/auth/register", data);
      return response.data;
    },
  });
};