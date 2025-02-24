"use client";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const userLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const credentials = {
      email,
      password,
    };

    try {
      const res = await axios.post(
        "https://lms-task-server.onrender.com/api/user/signin",
        credentials,
        {
          withCredentials: true,
        }
      );
      const user = res.data.data;
      if (user) {
        Cookies.set("currentUser", JSON.stringify(user), { expires: 1 });
      }
      // Redirect after successful login
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to Your Account
        </h2>
        <form className="space-y-6" onSubmit={userLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
          <div className="text-center">
            <Link href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
