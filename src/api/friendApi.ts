import type { Friend } from "../types/chat";
import { api } from "./axios";

// Returns an array of friends
export const getFriends = async (userId: string): Promise<Friend[]> => {
  try {
    const res = await api.get<Friend[]>(`/friends/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch friends", error);
    throw error; // Let React Query handle the error
  }
};

export const getSuggestions = async (): Promise<Friend[]> => {
  const res = await api.get("/users/suggestions");
  return res.data;
};

export const addFriend = async (userId: string) => {
  const res = await api.post("/friends/add", { userId });
  return res.data;
};