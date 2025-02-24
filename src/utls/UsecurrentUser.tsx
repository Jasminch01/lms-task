"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Tuser } from "@/types/type";

export default function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<Tuser | null>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = Cookies.get("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  return { currentUser, loading, setLoading };
}
