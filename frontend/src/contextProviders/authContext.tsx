import { ReactNode, createContext, useState } from "react";
// import { loginUser } from "../helpers/authProvider";
import { logInUser } from "@/lib/app";

interface User {
	username: string;
	id: number;
}

export interface UserAuth {
	user: User | undefined;
	isLoggedIn: () => boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => void;
}

export const AuthContext = createContext<UserAuth | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | undefined>(undefined);

	const login = async (username: string, password: string) => {
		console.log("Log in");
		try {
			// const data = await logInUser(username, password);
			const data = await logInUser();
			if (!data) {
				return;
			}
			setUser(data);
			console.log(data);
			return data;
		} catch (error) {
			console.error("Login error:", error);
		}
	};

	const logout = () => {
		console.log("Log out");
		setUser(undefined);
	};

	const isLoggedIn = () => {
		return user !== undefined;
	};

	const contextValue = {
		user,
		login,
		logout,
		isLoggedIn,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};
