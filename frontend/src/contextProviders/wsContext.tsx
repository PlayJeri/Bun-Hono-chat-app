import { createContext, ReactNode, useEffect, useState } from "react";
import { useAuth } from "./useAuthContext";
import { WebSocketMsg } from "@backend/src/Types";

export interface wsContext {
	ws: WebSocket | undefined;
	sendMessage: (message: WebSocketMsg) => void;
}

export const WebSocketContext = createContext<wsContext | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
	const [ws, setWs] = useState<WebSocket | undefined>(undefined);
	const authContext = useAuth();

	useEffect(() => {
		console.log("WS ctx provider run");
		if (!authContext.isLoggedIn) return;
		const socket = new WebSocket("ws://localhost:3000");

		socket.onopen = () => {
			console.log("WebSocket connection opened");
		};

		socket.onmessage = (event) => {
			console.log("WebSocket message received: ", event.data);
		};

		socket.onclose = () => {
			console.log("WebSocket connection closed");
		};

		socket.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		setWs(socket);

		return () => {
			socket.close();
		};
	}, [authContext]);

	const sendMessage = (message: WebSocketMsg) => {
		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify(message));
		} else {
			console.error("WebSocket is not open");
		}
	};

	const contextValue = {
		ws,
		sendMessage,
	};

	return (
		<WebSocketContext.Provider value={contextValue}>
			{children}
		</WebSocketContext.Provider>
	);
};
