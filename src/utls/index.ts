"use server";
// import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const clearCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
};

import axios from "axios";

// Define the type for the user data
export type Tuser = {
  data: Tuser | PromiseLike<Tuser>;
  id: string;
  email: string;
  role: string;
  // Add other fields as needed
};

// Fetch the current user from the server
export const fetchCurrentUser = async (userEmail: string): Promise<Tuser> => {
  try {
    const res = await axios.get<Tuser>(
      `https://lms-task-server.vercel.app/api/user/me?email=${userEmail}`,
      {
        withCredentials: true,
      }
    );

    // Return the user data 
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw new Error("Failed to fetch user data");
  }
};
