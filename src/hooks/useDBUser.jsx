import { axiosSecure } from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const fetchDBUser = async (uid) => {
  const response = await axiosSecure.get(`/user/${uid}`);
  return response.data;
};

const useDBUser = (uid, enabled = true) => {
  return useQuery({
    queryKey: ["dbUser", uid],
    queryFn: () => fetchDBUser(uid),
    enabled: !!uid && enabled,
  });
};

export default useDBUser;
