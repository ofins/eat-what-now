import { GoogleLogin, useLogin } from "@ofins/client";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router";
import { login as loginAsync } from "../../api/auth";
import "./Auth.css";

const Login = () => {
  const mutation = useMutation({
    mutationFn: loginAsync,
  });

  const {
    credentials,
    setEmail,
    setPassword,
    handleSubmit,
    isLoading,
    errors,
    isValid,
    isLoggedIn,
  } = useLogin({
    onLogin: async ({ email, password }) => {
      const data = await mutation.mutateAsync({ email, password });
      return data.token;
    },
    validate({ email, password }) {
      const errors: Record<string, string> = {};
      if (!email) {
        errors.email = "Email is required";
      }
      if (!password) {
        errors.password = "Password is required";
      }
      return Object.keys(errors).length ? errors : null;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl overflow-hidden">
        {/* Desktop Layout - 16:9 aspect ratio */}
        <div className="hidden lg:block">
          <div className="aspect-video flex">
            {/* Welcome Section - Left side */}
            <div className="w-1/3 bg-gradient-to-br from-blue-500 to-blue-600 p-6 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-white text-base font-semibold text-center mb-1">
                Welcome Back
              </h2>
              <p className="text-blue-100 text-xs text-center opacity-90 mb-2">
                Sign in to continue
              </p>
              <p className="text-blue-100 text-xs text-center opacity-80">
                Your food journey awaits
              </p>
            </div>

            {/* Form Section - Right side */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <h3 className="text-gray-800 text-sm font-semibold mb-4 pb-1 border-b-2 border-blue-500 inline-block">
                  Sign In
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                    disabled={isLoading || !isValid}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </button>

                  {errors.message && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-xs">
                      {errors.message}
                    </div>
                  )}

                  {isLoggedIn && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-md text-xs">
                      Login successful! Redirecting...
                    </div>
                  )}
                </form>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 text-center">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Create one here
                    </Link>
                  </p>
                </div>
                <GoogleLogin
                  endpoint={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Same theme as desktop */}
        <div className="block lg:hidden">
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-start justify-center">
            <div className="bg-white rounded-lg shadow-md w-full max-w-sm overflow-hidden">
              {/* Header Section with blue gradient */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-white text-base font-semibold mb-1">
                  Welcome Back
                </h2>
                <p className="text-blue-100 text-xs opacity-90">
                  Sign in to continue your food journey
                </p>
              </div>

              {/* Form Section */}
              <div className="p-4">
                <h3 className="text-gray-800 text-sm font-semibold mb-3 pb-1 border-b-2 border-blue-500 inline-block">
                  Sign In
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label
                      htmlFor="email-mobile"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email-mobile"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password-mobile"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password-mobile"
                      name="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 mt-4"
                    disabled={isLoading || !isValid}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </button>

                  {errors.message && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-xs mt-2">
                      {errors.message}
                    </div>
                  )}

                  {isLoggedIn && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-md text-xs mt-2">
                      Login successful! Redirecting...
                    </div>
                  )}
                </form>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 text-center">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Create one here
                    </Link>
                  </p>
                </div>
                <GoogleLogin
                  endpoint={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
