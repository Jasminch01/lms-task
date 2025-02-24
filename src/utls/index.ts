"use server";
// import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const logoutUser = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("currentUser");
};


export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get("currentUser")?.value;
  return currentUser;
};
