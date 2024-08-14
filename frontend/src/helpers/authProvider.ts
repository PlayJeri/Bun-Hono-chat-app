import axios from "axios";

export const loginUser = async (username: string, password: string) => {
  const res = await axios.post("/auth/login", { username, password });
  const data = await res.data;
  return data;
};
