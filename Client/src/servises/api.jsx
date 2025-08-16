import { axiosSecure } from "../hooks/useAxiosSecure";



// post by search
export const searchFilteredPosts = async ({ queryKey }) => {
  const [_key, { search }] = queryKey;

  const res = await axiosSecure.get("/post/search", {
    params: { search },
  });

  return res.data.posts;
};

// user to mongoDB
export const saveUserToDB = async (user) => {
  if (!user) {
    throw new Error("User data is required");
  }

  console.log("Saving user to DB:", user);

  try {
    const response = await axiosSecure.post("/users", user);
    console.log("User saved successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error saving user:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message || "Failed to save user to database"
    );
  }
};
