import { useContext } from "react";
import { WebSocketContext, wsContext } from "./wsContext";

export const useWebSocket = (): wsContext => {
	const context = useContext(WebSocketContext);
	if (!context) {
		throw new Error("useWebSocket must be used within the ws provider");
	}
	return context;
};
