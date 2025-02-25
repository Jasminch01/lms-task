"use server";
import { cookies } from "next/headers";

export const clearCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
};
