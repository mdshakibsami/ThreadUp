import { axiosSecure } from "../hooks/useAxiosSecure";

export const fetchPosts = async () => {
  const response = await axiosSecure.get("/posts");
  return response.data;
};

export const searchFilteredPosts = async ({ queryKey }) => {
  const [_key, { search }] = queryKey;

  const res = await axiosSecure.get("/post/search", {
    params: { search },
  });

  return res.data.posts;
};
