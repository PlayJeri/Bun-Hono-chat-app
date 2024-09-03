// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./contextProviders/authContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { WebSocketProvider } from "./contextProviders/wsContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	<AuthProvider>
		<WebSocketProvider>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</WebSocketProvider>
	</AuthProvider>
	// </StrictMode>,
);
