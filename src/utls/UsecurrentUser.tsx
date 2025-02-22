"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Tuser } from "@/types/type"; // Ensure Tuser is properly defined

export default function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<Tuser | null>(null);

  console.log(currentUser)

  // Load user from token in cookies
  useEffect(() => {
    const storedUser = Cookies.get("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to update and store user info
  const userData = (user: Tuser) => {
    setCurrentUser(user);
    Cookies.set("currentUser", JSON.stringify(user), { expires: 1 }); // Store user for 1 day
  };

  // Function to clear user info (logout)
  const logoutUser = () => {
    setCurrentUser(null);
    Cookies.remove("currentUser");
    Cookies.remove("accessToken");
  };

  return { currentUser, userData, logoutUser };
}