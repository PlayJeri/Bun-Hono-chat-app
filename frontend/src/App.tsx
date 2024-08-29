import { useAuth } from "./contextProviders/useAuthContext";
import { LoginPage } from "./pages/loginPage";
import { SideBar } from "./components/sideBar";
import { ChatSection } from "./components/chatSection";

function App() {
	const authProvider = useAuth();

	return (
		<>
			<div className="flex h-screen bg-gray-800">
				{/* Sidebar */}
				<SideBar />

				{/* Main area */}
				<div className="flex flex-col w-full h-screen bg-gray-800">
					{authProvider.isLoggedIn() ? <ChatSection /> : <LoginPage />}
				</div>
			</div>
		</>
	);
}

export default App;
