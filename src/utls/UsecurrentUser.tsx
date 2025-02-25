import { Tuser } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface SignUpUserData {
  name: string;
  email: string;
}

const fetchCurrentUser = async (userEmail: string): Promise<Tuser> => {
  const res = await axios.get<Tuser>(
    `http://localhost:5000/api/user/me?email=${userEmail}`,
    {
      withCredentials: true,
    }
  );

  return res.data; // Return the user data
};

export const useCurrentUser = (userEmail: string) => {
  return useQuery<Tuser, Error>({
    queryKey: ["currentUser", userEmail],
    queryFn: () => fetchCurrentUser(userEmail),
    enabled: !!userEmail,
  });
};

const signUpUser = async (userData: SignUpUserData): Promise<Tuser> => {
  const res = await axios.post<Tuser>(
    "http://localhost:5000/api/user/signup",
    userData,
    { withCredentials: true }
  );
  return res.data; // Return the user data
};

export const useSignUpUser = () => {
  return useMutation<Tuser, Error, SignUpUserData>({
    mutationFn: signUpUser,
  });
};

