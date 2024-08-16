import { useContext } from "react";
import { AuthContext } from "./authContext";
import { UserAuth } from "./authContext";

export const useAuth = (): UserAuth => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth bust be used within an AuthProvider");
  }
  return context;
};
