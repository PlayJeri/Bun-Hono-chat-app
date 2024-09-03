import { useAuth } from "./contextProviders/useAuthContext";
import { LoginPage } from "./pages/loginPage";
import { SideBar } from "./components/sideBar";
import { ChatSection } from "./components/chatSection";
import { useState } from "react";
import { ChatData } from "./types";

function App() {
	const authProvider = useAuth();
	const [selectedChatData, setSelectedChatData] = useState<ChatData | null>(
		null
	);

	return (
		<>
			<div className="flex h-screen bg-gray-800">
				{/* Sidebar */}
				<SideBar onSelectChat={setSelectedChatData} />

				{/* Main area */}
				<div className="flex flex-col w-full h-screen bg-gray-800">
					{authProvider.isLoggedIn ? (
						<ChatSection chatData={selectedChatData} />
					) : (
						<LoginPage />
					)}
				</div>
			</div>
		</>
	);
}

export default App;
