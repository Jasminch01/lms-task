"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Tuser } from "@/types/type";

export default function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<Tuser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  console.log(currentUser);
  useEffect(() => {
    const storedUser = Cookies.get("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const userData = (user: Tuser) => {
    setCurrentUser(user);
    Cookies.set("currentUser", JSON.stringify(user), { expires: 1 }); // Save user data in cookies
  };

  const logoutUser = () => {
    setCurrentUser(null);
    Cookies.remove("currentUser");
    Cookies.remove("accessToken");
  };

  return { currentUser, userData, logoutUser, loading, setLoading };
}
