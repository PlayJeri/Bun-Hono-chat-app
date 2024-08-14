import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginUser } from "../helpers/authProvider";

interface User {
  username: string;
  id: string;
}

interface UserAuth {
  isLoggedIn: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<UserAuth>({} as UserAuth);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log("MORO MORO USEEFFECTILT");
  }, []);

  // Function to log in a user
  const login = async (username: string, password: string) => {
    const data = await loginUser(username, password);
    if (!data) {
      console.log("LOLLERO");
      return;
    }
    setUser(data);
    console.log(data);
  };

  // Function to log out a user
  const logout = async () => {
    window.location.reload(); // Refresh the page after logout
  };

  // Create the context value to provide to the context consumers
  const contextValue = {
    user,
    isLoggedIn,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
