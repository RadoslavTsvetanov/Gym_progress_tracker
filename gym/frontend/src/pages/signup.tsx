"use client"
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { gateway_url, application_url } from './constant_variables/constants';
import Loader from "~/components/loader"
const Signup = () => {

  const router = useRouter()
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${gateway_url}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Signup request failed');
      }

      console.log('User signed up successfully!');
      setIsLoading(false);
      // Redirect to a new route after successful signup
      router.replace(`${application_url}/login`)
    } catch (error: unknown) {
      setError('Signup error: ' + error.message);
      console.error('Signup error:', error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-blue-500 text-gray-800"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-blue-500 text-gray-800"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            {Loader(isLoading,"signing up ...")}
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
          <div>
            <p>already have an account?</p>
          <Link href={`${application_url}/login`} className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Login
          </Link>
            {error && <div className="text-red-500">{error}</div>}
            </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

