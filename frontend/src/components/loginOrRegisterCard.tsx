import { useState } from "react";
import { LoginForm } from "./loginForm";
import { RegisterForm } from "./registerForm";

export const LoginOrRegisterCard = () => {
	const [isLogin, setIsLogin] = useState(true);

	const toggleAuth = () => setIsLogin(!isLogin);

	return (
		<div className="w-full max-w-4xl overflow-hidden bg-gray-900 shadow-glow shadow-indigo-900 rounded-2xl">
			<div className="flex h-[600px] relative">
				{/* Login Form */}
				<div className="z-0 w-1/2 p-8">
					<LoginForm />
				</div>

				{/* Register Form */}
				<div className="z-0 w-1/2 p-8">
					<RegisterForm />
				</div>

				{/* Sliding Gradient Overlay */}
				<div
					className={`absolute top-0 bottom-0 w-1/2 transition-all duration-500 ease-in-out z-20 ${
						isLogin ? "right-0" : "right-1/2"
					}`}
				>
					<div className="flex items-center justify-center h-full p-8 overflow-hidden text-gray-100 ease-out bg-gradient-to-br from-indigo-800 to-purple-900">
						<div className="relative w-full h-full">
							<div
								className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
									isLogin ? "opacity-100" : "opacity-0"
								}`}
							>
								<div className="text-center">
									<h2 className="mb-4 text-3xl font-bold">Welcome Back!</h2>
									<p className="text-lg text-gray-300">
										We're glad to see you again. Access your account now.
									</p>
								</div>
							</div>
							<div
								className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
									isLogin ? "opacity-0" : "opacity-100"
								}`}
							>
								<div className="text-center">
									<h2 className="mb-4 text-3xl font-bold">Join Us Today!</h2>
									<p className="text-lg text-gray-300">
										Create an account and start your journey with us.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Toggle Button */}
			<div className="p-4 text-center text-purple-300 bg-slate-800">
				<button className="w-full" type="submit" onClick={toggleAuth}>
					{isLogin
						? "Don't have an account? Register"
						: "Already have an account? Login"}
				</button>
			</div>
		</div>
	);
};
