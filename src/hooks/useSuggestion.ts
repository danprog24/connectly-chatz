import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import { useFriend } from "./useFriends";

export interface User {
  id: number;        // backend returns Long as number, not string
  username: string;
  email?: string;    // backend returns this
  avatar?: string;
  online: boolean;
}

export const useSuggestions = (loggedInUserId: string) => {
  const { data: friends } = useFriend(loggedInUserId);

  return useQuery<User[]>({
    queryKey: ["suggestions", loggedInUserId, friends?.map((f) => f.id)],
    queryFn: async () => {
      const res = await api.get<User[]>("/users/");
      
      //  filter by username since loggedInUserId is actually a username
      let suggestions = res.data.filter((user) => user.username !== loggedInUserId);
      
      if (friends) {
        suggestions = suggestions.filter(
          (user) => !friends.some((f) => f.id === user.id)
        );
      }

      return suggestions;
    },
    enabled: !!loggedInUserId,
  });
};