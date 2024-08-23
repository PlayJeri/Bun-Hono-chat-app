// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/authContext.tsx";
import { WebSocketProvider } from "./contexts/wsContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
	// <React.StrictMode>
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<WebSocketProvider>
				<App />
			</WebSocketProvider>
		</AuthProvider>
	</QueryClientProvider>
	// </React.StrictMode>
);
