import { axiosSecure } from "../hooks/useAxiosSecure";

export const fetchPosts = async () => {
  const response = await axiosSecure.get("/posts");
  return response.data;
};
