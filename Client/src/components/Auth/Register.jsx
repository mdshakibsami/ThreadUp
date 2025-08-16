import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import "./sweetalert-custom.css";
import { useNavigate } from "react-router";
import { saveUserToDB } from "../../servises/api";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { createUser, googleSignIn, updateUser } = useAuth();
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data) => {
    console.log("Registration data:", data);
    const name = data.firstName + " " + data.lastName;
    const profileInfo = {
      displayName: name,
      photoURL:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    };
    // Show loading alert
    Swal.fire({
      title: "Creating Account...",
      text: "Please wait while we create your account",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: "custom-swal-popup",
        title: "custom-swal-title",
        content: "custom-swal-content",
      },
      background: "#ffffff",
      color: "#374151",
    });

    try {
      const result = await createUser(data.email, data.password);
      console.log("result", result);
      const user = result.user;

      //update user info in DB

      const saveUser = {
        uid: user.uid,
        email: user.email,
        name: name, // Add the user's name
        photoURL: profileInfo.photoURL, // Add profile photo
        role: "user",
        badge: "bronze",
        isMember: false,
        isAdmin: false,
        postCount: 0,
        createdAt: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      // Save to MongoDB
      try {
        await saveUserToDB(saveUser);
        console.log("User saved to database successfully");
      } catch (dbError) {
        console.error("Database save error:", dbError);
        throw new Error("Failed to save user data. Please try again.");
      }

      updateUser(profileInfo)
        .then((res) => {
          console.log(res);

          // Success alert
          Swal.fire({
            icon: "success",
            title: "Account Created Successfully!",
            text: `Welcome to ThreadUp, ${data.firstName}! Your account has been created.`,
            confirmButtonText: "Get Started",
            customClass: {
              popup: "custom-swal-popup",
              title: "custom-swal-title",
              content: "custom-swal-content",
              confirmButton: "custom-swal-confirm-btn",
            },
            background: "#ffffff",
            color: "#374151",
            iconColor: "#10b981",
            showClass: {
              popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp",
            },
          }).then(() => {
            navigate("/");
          });
        })
        .catch((error) => console.log(error));

      console.log(profileInfo);
    } catch (error) {
      console.log(error);

      // Error alert
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Something went wrong. Please try again.",
        confirmButtonText: "Try Again",
        customClass: {
          popup: "custom-swal-popup",
          title: "custom-swal-title",
          content: "custom-swal-content",
          confirmButton: "custom-swal-error-btn",
        },
        background: "#ffffff",
        color: "#374151",
        iconColor: "#ef4444",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
      });
    }
  };

  // google login
  const handleLogin = async () => {
    try {
      const result = await googleSignIn();
      console.log(result);
      const user = result.user;

      try {
        const saveUser = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "",
          photoURL: user.photoURL || "",
          role: "user",
          badge: "bronze",
          isMember: false,
          isAdmin: false,
          postCount: 0,
          createdAt: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        // Save to MongoDB
        await saveUserToDB(saveUser);

        // Success alert
        Swal.fire({
          icon: "success",
          title: "Welcome!",
          text: "You have successfully signed in with Google.",
          confirmButtonText: "Continue",
          customClass: {
            popup: "custom-swal-popup",
            title: "custom-swal-title",
            content: "custom-swal-content",
            confirmButton: "custom-swal-confirm-btn",
          },
          background: "#ffffff",
          color: "#374151",
          iconColor: "#10b981",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        }).then(() => {
          navigate("/");
        });
      } catch (error) {
        console.log(error, "fail to insert user in DB");
      }
    } catch (error) {
      console.log(error);

      // Error alert
      Swal.fire({
        icon: "error",
        title: "Sign In Failed",
        text:
          error.message ||
          "Google sign in was cancelled or failed. Please try again.",
        confirmButtonText: "Try Again",
        customClass: {
          popup: "custom-swal-popup",
          title: "custom-swal-title",
          content: "custom-swal-content",
          confirmButton: "custom-swal-error-btn",
        },
        background: "#ffffff",
        color: "#374151",
        iconColor: "#ef4444",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2">
        {/* Left side - GIF Logo */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-8 lg:p-12">
          <div className="text-center">
            <div className="mb-8">
              <img
                src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXZkZjNhOGl2bWQ4b2w3eGNienZsY3FmNXNkaXRhbDdmemg3YnFyaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46Cy1rHbQ92uuLXa/giphy.gif"
                alt="ThreadUp Register"
                className="w-32 h-32 lg:w-40 lg:h-40 mx-auto rounded-full bg-white p-4 shadow-lg"
              />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Join ThreadUp
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 mb-8">
              Create your account and start connecting with amazing people
            </p>
            <div className="space-y-4 text-blue-100">
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Easy to use</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Join thousands of users</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure and private</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Register Form */}
        <div className="p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">Sign up to get started</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium">
                      First Name
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    className={`input input-bordered w-full ${
                      errors.firstName ? "input-error" : "focus:input-primary"
                    }`}
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters",
                      },
                    })}
                  />
                  {errors.firstName && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.firstName.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 font-medium">
                      Last Name
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    className={`input input-bordered w-full ${
                      errors.lastName ? "input-error" : "focus:input-primary"
                    }`}
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters",
                      },
                    })}
                  />
                  {errors.lastName && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.lastName.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`input input-bordered w-full ${
                    errors.email ? "input-error" : "focus:input-primary"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.email.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`input input-bordered w-full ${
                    errors.password ? "input-error" : "focus:input-primary"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain uppercase, lowercase, and number",
                    },
                  })}
                />
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.password.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">
                    Confirm Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className={`input input-bordered w-full ${
                    errors.confirmPassword
                      ? "input-error"
                      : "focus:input-primary"
                  }`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.confirmPassword.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    {...register("terms", {
                      required: "You must agree to the terms and conditions",
                    })}
                  />
                  <span className="label-text text-gray-700">
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </label>
                {errors.terms && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.terms.message}
                    </span>
                  </label>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full text-white font-medium py-3 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Create Account
              </button>
            </form>

            <div className="divider my-8">OR</div>

            <div className="space-y-4">
              <button
                onClick={handleLogin}
                className="btn btn-outline w-full flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Sign up with Google</span>
              </button>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
