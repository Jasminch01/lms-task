"use client";
import useCurrentUser from "@/utls/UsecurrentUser";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const { userData } = useCurrentUser();

  const userLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const crediential = {
      email,
      password,
    };

    const loginUser = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/user/signin",
          crediential,
          {
            withCredentials: true,
          }
        );
        const user = res.data.data;
        userData(user);

        if (callbackUrl) {
          router.push(callbackUrl as string);
        }
        router.push("/");
      } catch (error) {
        console.log(error);
      }
    };
    loginUser();
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
          <div className="text-center">
            <Link href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
