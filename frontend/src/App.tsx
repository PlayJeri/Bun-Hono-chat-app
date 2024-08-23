import { useState } from "react";
import { useAuth } from "./contexts/useAuthContext";
import "./App.css";
import { useWebSocket } from "./contexts/useWsContext";

function App() {
	const [count, setCount] = useState(0);
	const authContext = useAuth();
	const wsContext = useWebSocket();

	return (
		<div className="h-screen w-screen flex items-center justify-center">
			<div className="bg-green-500 flex flex-col items-center justify-center px-16 py-8 rounded-2xl">
				<h1 className="text-4xl text-red-400 text-center">Hello</h1>
				<button
					className="bg-blue-600 text-red-200 rounded-xl px-4"
					onClick={() => setCount(count + 1)}
				>
					{count}
				</button>
				<button onClick={() => authContext.login("IsoMies", "isomolc")}>
					Login
				</button>
				<p>{authContext.user ? authContext.user.username : "not logged in"}</p>
				<button className="bg-blue-700 text-red-300 rounded-xl px-4">
					Open WS
				</button>
				<button
					onClick={() => wsContext.sendMessage("MORO MORO")}
					className="bg-blue-700 text-red-300 rounded-xl px-4"
				>
					Send message
				</button>
			</div>
		</div>
	);
}

export default App;
