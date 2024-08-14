import React from 'react'
import {  useState } from "react";
import axios from 'axios';
import { Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/copracesss.png';
const login = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          // Make login request to obtain authentication token
          const response = await axios.post(`${API_URL}users/login`, { email, password });
          const token = response.data.token;
          //Store token for further use
          localStorage.setItem('authToken', token);

          // Get the user information 
          const authResponse = await axios.post(`${API_URL}users`, null, {
            headers: { Authorization: `Bearer ${token}` }
          });
          localStorage.setItem('user_info', JSON.stringify(authResponse.data));
          
          // If the user is authorized, navigate to the homepage and pass the user info
          navigate('/', { authResponse });
        } catch (error) {
          console.log('Login error:', error.message);
          // Handle unauthorized scenario here
        }
      };
  return (
    <div>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 select-none">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                {/* <img
                    className="mx-auto h-10 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                /> */}
                <img
                    className="mx-auto h-30 w-auto select-none"
                    src={logo}
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Email address
                    </label>
                    <div className="mt-2">
                        <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)} 
                        autoComplete="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    </div>

                    <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                        Password
                        </label>
                    
                    </div>
                    <div className="mt-2">
                        <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)} 
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    </div>

                    <div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-custom-green px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-hover-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Sign in
                    </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    No Account Yet?{' '}
                    <Link to = '/signup' className="font-semibold leading-6 text-custom-green hover:text-hover-green">
                    Create an Account
                    </Link>
                  
                </p>
            </div>
            </div>
    </div>
  )
}

export default login