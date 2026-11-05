// import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from './LoginForm'
function Login() {
    return (
        <div className="flex items-center justify-center h-screen">

            <div className="w-[400px] border p-6 rounded-lg shadow">

                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Login
                </h2>

                <LoginForm />
                <p className='text-sm text-center'>
                    Don't have an account ?
                    <Link to='/register' className='text-blue-600 ml-1'>
                        Register
                    </Link>

                </p>
                <p className='text-sm text-center'>
                    <Link to='/forgotpassword' className='text-red-600 ml-1'>
                    Forgot Password</Link>

                </p>

            </div>

        </div>
    )
}

export default Login
