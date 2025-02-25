import { Tuser } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCurrentUser = async (userEmail: string): Promise<Tuser> => {
  const res = await axios.get<Tuser>(
    `https://lms-task-server.onrender.com/api/user/me?email=${userEmail}`,
    {
      withCredentials: true,
    }
  );
  return res.data.data; // Return the user data
};

const useCurrentUser = (userEmail: string) => {
  return useQuery<Tuser, Error>({
    queryKey: ["currentUser", userEmail], 
    queryFn: () => fetchCurrentUser(userEmail), 
    enabled: !!userEmail, 
  });
};

export default useCurrentUser;
