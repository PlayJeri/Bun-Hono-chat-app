import { useContext } from "react";
import { AuthContext, UserAuth } from "./authContext";

export const useAuth = (): UserAuth => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
