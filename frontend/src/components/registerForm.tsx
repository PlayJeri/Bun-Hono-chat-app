import { useAuth } from '@/contextProviders/useAuthContext';
import React, { useState } from 'react'

export const RegisterForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { register } = useAuth();

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		if (username.length < 3 && password.length < 5 && password !== confirmPassword) {
			alert("Invalid");
			return;
		}
		await register(username, password);
	}

  return (
	<>
	<h2 className='mb-6 text-2xl font-bold text-gray-100'>Register</h2>
	<form className='items-center content-center px-4 space-y-8' onSubmit={handleSubmit}>
		<div className="flex flex-col">
			<label className="text-gray-300" htmlFor="username">Username</label>
			<input className="p-2 text-lg text-gray-100 placeholder-gray-500 bg-gray-800 border-gray-700 rounded-md" placeholder='Enter your username' type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
		</div>
		<div className="flex flex-col">
			<label className="text-gray-300" htmlFor="password">Password</label>
			<input className="p-2 text-lg text-gray-100 placeholder-gray-500 bg-gray-800 border-gray-700 rounded-md" placeholder='Enter your password' type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
		</div>
		<div className="flex flex-col">
			<label className="text-gray-300" htmlFor="confirmPassword">Confirm Password</label>
			<input className="p-2 text-lg text-gray-100 placeholder-gray-500 bg-gray-800 border-gray-700 rounded-md" placeholder='Confirm your password' type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
		</div>
		<button className='w-full py-2 text-xl text-gray-100 bg-indigo-600 rounded-lg hover:bg-indigo-700' type="submit">Register</button>
	</form>
</>
  )
}
