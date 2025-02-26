"use server";
// import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const clearCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
};

export const getCurrentUser = async () => {
  const cookeieStore = await cookies();
  const token = cookeieStore.get("accessToken")

  // let decodedToken = null;

  // if (accessToken) {
  //   decodedToken = await jwtDecode(accessToken);

  //   return {
  //     email: decodedToken.email,
  //     role: decodedToken.role,
  //   };
  // }

  return token;
};
