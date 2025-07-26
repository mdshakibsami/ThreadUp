import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { axiosSecure } from "../../hooks/useAxiosSecure";

const AddPost = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
  } = useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch tags using TanStack Query
  const { data: tagsData, isLoading: tagsLoading, isError: tagsError } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await axiosSecure.get("/tags");
      return response.data;
    },
  });

  console.log("Fetched tags data:", tagsData);

  // Extract tags from the response (based on API structure: { success: true, tags: [...] })
  const tagOptions = tagsData?.tags?.map(tag => tag.name) || [];

  // Handle tag selection
  const handleTagToggle = (tag) => {
    const tagLower = tag.toLowerCase();
    if (selectedTags.includes(tagLower)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagLower));
    } else {
      setSelectedTags([...selectedTags, tagLower]);
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    // Preview
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    // Upload to imgbb
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=f59c5887a63b13118269365620e66a33`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.success) {
        const imageUrl = data.data.url;
        setImageURL(imageUrl);
      } else {
        console.error("Upload failed", data);
      }
    } catch (err) {
      console.error("Error uploading image to imgbb:", err);
    }
  };

  const onSubmit = async (data) => {
    // Validation for required fields
    if (selectedTags.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Tags",
        text: "Please select at least one tag for your post.",
        customClass: {
          popup: "swal-custom-popup",
          title: "swal-custom-title",
          confirmButton: "swal-custom-confirm",
        },
      });
      return;
    }

    if (!imageFile || !imageURL) {
      Swal.fire({
        icon: "error",
        title: "Missing Image",
        text: "Please select an image for your post and wait for it to upload.",
        customClass: {
          popup: "swal-custom-popup",
          title: "swal-custom-title",
          confirmButton: "swal-custom-confirm",
        },
      });
      return;
    }

    // Show loading alert
    Swal.fire({
      title: "Creating Post...",
      text: "Please wait while we create your post.",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: "swal-custom-popup",
        title: "swal-custom-title",
      },
    });

    try {
      const postData = {
        title: data.title,
        description: data.description,
        tags: selectedTags, // Array of tags
        authorName: user.displayName,
        authorEmail: user.email,
        authorImage:
          user.photoURL ||
          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
        userId: user.uid,
        upVote: 0,
        downVote: 0,
        comments: [],
        visibility: data.visibility,
        image: imageURL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Post Data:", postData);
      console.log("Selected Tags:", selectedTags);

      const response = await axiosSecure.post("/posts", postData);

      if (response?.data) {
        console.log("Success:", response.data);

        // Success alert
        Swal.fire({
          icon: "success",
          title: "Post Created!",
          text: "Your post has been successfully created.",
          customClass: {
            popup: "swal-custom-popup",
            title: "swal-custom-title",
            confirmButton: "swal-custom-confirm",
          },
        });

        // Reset form
        // reset();
        setImageFile(null);
        setImagePreview(null);
        setImageURL(null);
        setSelectedTags([]);
      }
    } catch (error) {
      console.error("Error creating post:", error);

      // Close loading alert first
      Swal.close();

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Something went wrong while creating your post.",
        customClass: {
          popup: "swal-custom-popup",
          title: "swal-custom-title",
          confirmButton: "swal-custom-confirm",
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Create New Post
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Share your thoughts and ideas with the community
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-200 p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Post Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-bold text-purple-700 mb-2"
              >
                Post Title *
              </label>
              <input
                type="text"
                id="title"
                {...register("title", {
                  required: "Post title is required",
                  minLength: {
                    value: 5,
                    message: "Title must be at least 5 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Title must not exceed 100 characters",
                  },
                })}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gradient-to-r from-purple-50 to-pink-50"
                placeholder="Enter your post title..."
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Post Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-bold text-purple-700 mb-2"
              >
                Post Description *
              </label>
              <textarea
                id="description"
                rows="6"
                {...register("description", {
                  required: "Post description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                  maxLength: {
                    value: 1000,
                    message: "Description must not exceed 1000 characters",
                  },
                })}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none bg-gradient-to-r from-purple-50 to-pink-50"
                placeholder="Write your post description..."
              ></textarea>
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-bold text-purple-700 mb-2"
              >
                Post Image *
              </label>
              <div className="mt-2">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gradient-to-r from-purple-50 to-pink-50"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg shadow-lg border-2 border-purple-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-bold text-purple-700 mb-2">
                Visibility *
              </label>
              <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="public"
                    {...register("visibility", {
                      required: "Please select visibility",
                    })}
                    className="h-4 w-4 text-purple-600 border-purple-300 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm text-purple-700 font-medium">
                    🌍 Public - Anyone can see this post
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="private"
                    {...register("visibility", {
                      required: "Please select visibility",
                    })}
                    className="h-4 w-4 text-purple-600 border-purple-300 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm text-purple-700 font-medium">
                    🔒 Private - Only you can see this post
                  </span>
                </label>
              </div>
              {errors.visibility && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {errors.visibility.message}
                </p>
              )}
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block text-sm font-bold text-purple-700 mb-2">
                Select Tags * (Choose multiple)
              </label>

              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium mb-2">
                    Selected Tags:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-white hover:text-purple-500 rounded-full p-1 transition-colors duration-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag Options Grid */}
              {tagsLoading ? (
                <div className="flex justify-center items-center p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <span className="ml-3 text-purple-600 font-medium">Loading tags...</span>
                </div>
              ) : tagsError ? (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-600 font-medium">Failed to load tags. Please try again.</p>
                </div>
              ) : tagOptions.length === 0 ? (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-600 font-medium">No tags available. Please contact admin to add tags.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 max-h-60 overflow-y-auto">
                  {tagOptions.map((tag) => {
                    const isSelected = selectedTags.includes(tag.toLowerCase());
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                            : "bg-white text-purple-700 border border-purple-200 hover:bg-purple-100 hover:border-purple-300"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedTags.length === 0 && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  Please select at least one tag for your post
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-10 rounded-2xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-purple-300"
              >
                ✨ Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
