"use client"
import React from 'react';
import { gateway_url } from '../constant_variables/constants';

interface LoginResponse {
  token: string;
}

const Login: React.FC = () => {
  const loginUser = async (data: { username: string; password: string }): Promise<LoginResponse> => {
    const response = await fetch(`${gateway_url}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Incorrect username or password');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const { token } = await loginUser({ username, password });

      // Storing token in an HTTP-only cookie
      document.cookie = `accessToken=${token}; path=/; HttpOnly; Secure`; // Modify as needed

      // If login successful, you can redirect the user
      // For example:
      window.location.href = '/'; // Redirect to dashboard on success
    } catch (error) {
      console.error(error);
      // Handle incorrect username or password error here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Log In</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-blue-500 text-gray-800"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-blue-500 text-gray-800"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
