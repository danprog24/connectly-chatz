import { api } from "./axios";
import type { Message } from "../types/chat";

export const getMessages = async (roomName: string): Promise<Message[]> => {
  const res = await api.get(`/messages/room/${roomName}`);
  return res.data;
};
export const sendMessage = async (data: {
  receiverId: string;
  content: string;
}): Promise<Message> => {
  if (!data.receiverId) throw new Error("receiverId is required");
  if (!data.content.trim()) throw new Error("Message content cannot be empty");
  const res = await api.post("/messages", data);
  return res.data;
};
