import React from 'react';
import axios from 'axios';
import { gateway_url } from './constant_variables/constants';
import { CookieHandler } from '~/utils/cookie_handler';
import Cookies from 'js-cookie';
interface LoginResponse {
  token: string;
}

const Login: React.FC = () => {
  const cookie_handler = new CookieHandler();

  const loginUser = async (data: { username: string; password: string }): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${gateway_url}/auth/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Incorrect username or password');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const { token } = await loginUser({ username, password });
      console.log(token)
      // cookie_handler.setCookie('accessToken', token, {
      //   expires: 7, // Expires in 7 days
      //   httpOnly: true,
      //   secure: true,
      // });
      Cookies.set("user", JSON.stringify({username:username,token:token}), {
        expires: 7,
      })
      // If login successful, you can redirect the user
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
