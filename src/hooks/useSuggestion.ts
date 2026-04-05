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
  console.log("1. useSuggestions called with:", loggedInUserId);
  console.log("2. enabled:", !!loggedInUserId);
  const { data: friends } = useFriend(loggedInUserId);

  return useQuery<User[]>({
    queryKey: ["suggestions", loggedInUserId, friends?.map((f) => f.id)],
    queryFn: async () => {
       console.log("3. queryFn firing...");
      const res = await api.get<User[]>("/api/users/");
      console.log("4. raw response:", res.data);
      
      //  filter by username since loggedInUserId is actually a username
      let suggestions = res.data.filter((user) => user.username !== loggedInUserId);
      console.log("Filtered suggestions:", suggestions);

      
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