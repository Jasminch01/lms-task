import { Tuser } from '@/types/type';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
interface SignUpUserData {
  name: string;
  email: string;
}

const signUpUser = async (userData: SignUpUserData): Promise<Tuser> => {
  const res = await axios.post<Tuser>(
    'https://lms-task-server.onrender.com/api/user/signup',
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