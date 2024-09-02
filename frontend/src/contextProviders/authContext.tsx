import { ReactNode, createContext, useState } from "react";
// import { loginUser } from "../helpers/authProvider";
import { logInUser } from "@/lib/app";

interface User {
	username: string;
	id: number;
}

export interface UserAuth {
	user: User | undefined;
	isLoggedIn: boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => void;
	register: (username: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<UserAuth | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	const login = async (username: string, password: string) => {
		console.log("Log in");
		try {
			const data = await logInUser(username, password);
			if (!data) {
				return;
			}
			setUser(data);
			setIsLoggedIn(true);
			console.log(data);
		} catch (error) {
			console.error("Login error:", error);
		}
	};

	const register = async (username: string, password: string) => {
		console.log(username, password);
	};

	const logout = () => {
		console.log("Log out");
		setUser(undefined);
		setIsLoggedIn(false);
	};

	const contextValue = {
		user,
		login,
		logout,
		isLoggedIn,
		register,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};
