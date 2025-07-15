import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import "./sweetalert-custom.css";
import { useNavigate } from "react-router";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signIn, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data);

    // Show loading alert
    Swal.fire({
      title: "Signing In...",
      text: "Please wait while we sign you in",
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
      const result = await signIn(data.email, data.password);
      console.log(result);

      // Success alert
      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "You have successfully signed in to ThreadUp.",
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
        // Redirect to home
        navigate("/");
      });
    } catch (error) {
      console.log(error);

      // Error alert
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid email or password. Please try again.",
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
        // Navigate to home
        window.location.href = "/";
        navigate("/");
      });
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
                src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXl5cTdkdHNtYmJoYmZ4bGQxNW9lNGNvdGR3ZXFqMTFkN2VsNGFiayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif"
                alt="ThreadUp Login"
                className="w-32 h-32 lg:w-40 lg:h-40 mx-auto rounded-full bg-white p-4 shadow-lg"
              />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              ThreadUp
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 mb-8">
              Connect, Share, and Discover Amazing Content
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
                <span>Connect with like-minded people</span>
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
                <span>Share your thoughts and ideas</span>
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
                <span>Discover trending content</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back!
              </h2>
              <p className="text-gray-600">Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full focus:input-primary"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full focus:input-primary"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <span className="text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full text-white font-medium py-3 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Sign In
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
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
