import { api } from "./axios";

export const login = async (data: {
    username: string;
    password: string;
  }) => {
    const res = await api.post("/auth/login", data);
    console.log("Login payload:", JSON.stringify(data));
    return res.data;
};

export const logout = async () => {
 const res = await api.post("/auth/logout", null);
 return res.data;
};