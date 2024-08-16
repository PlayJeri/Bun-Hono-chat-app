import { ReactNode, createContext, useState } from "react";
import { loginUser } from "../helpers/authProvider";

interface User {
  username: string;
  id: string;
}

export interface UserAuth {
  user: User | undefined;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<UserAuth | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const login = async (username: string, password: string) => {
    console.log("Log in");
    try {
      const data = await loginUser(username, password);
      if (!data) {
        return;
      }
      setUser(data);
      console.log(data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    console.log("Log out");
    setUser(undefined);
  };

  const contextValue = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
