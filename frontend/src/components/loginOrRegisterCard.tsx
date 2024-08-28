import { useState } from 'react'
import { LoginForm } from './loginForm'
import { RegisterForm } from './registerForm'

export const LoginOrRegisterCard = () => {
  const [isLogin, setIsLogin] = useState(true)

  const toggleAuth = () => setIsLogin(!isLogin)

  return (
    <div className="w-full max-w-4xl overflow-hidden bg-gray-900 rounded-2xl">
      <div className="flex h-[600px] relative">
        {/* Login Form */}
        <div className="z-0 w-1/2 p-8">
         <LoginForm/> 
        </div>

        {/* Register Form */}
        <div className="z-0 w-1/2 p-8">
			  <RegisterForm/>
        </div>

        {/* Sliding Gradient Overlay */}
        <div
          className={`absolute top-0 bottom-0 w-1/2 transition-all duration-500 ease-in-out ${
            isLogin ? 'right-0' : 'right-1/2'
          }`}
        >
          <div className="z-10 flex items-center justify-center h-full p-8 text-slate-200 bg-gradient-to-br from-purple-900 to-indigo-700">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold">
                {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
              </h2>
              <p className="text-lg">
                {isLogin
                  ? "We're glad to see you again. Access your account now."
                  : 'Create an account and start your journey with us.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="p-4 text-center bg-slate-800 text-slate-200">
        <button className='w-full' type="submit" onClick={toggleAuth}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  )
}