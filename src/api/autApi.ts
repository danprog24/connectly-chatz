import { api } from "./axios";

export const login = async (data: {
    username: string;
    password: string;
  }) => {
    const res = await api.post("/api/auth/login", data);
    return res.data;
};

export const logout = async () => {
 const res = await api.post("/api/auth/logout", null);
 return res.data;
};