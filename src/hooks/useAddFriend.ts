import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFriend } from "../api/friendApi";

export const useAddFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFriend,
    onSuccess: () => {
      // refresh suggestions after adding
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
};