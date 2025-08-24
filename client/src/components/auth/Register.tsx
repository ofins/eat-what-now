import { useRegister } from "@ofins/client";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router";
import { register } from "../../api/auth";
import "./Auth.css";

interface RegisterResponse {
  token: string;
  user?: unknown;
}

const Register = () => {
  const {
    credentials,
    setEmail,
    setPassword,
    setUsername,
    setFirstName,
    setLastName,
    handleSubmit,
    isLoading,
    errors,
  } = useRegister({
    onRegister: async ({ email, password, firstName, username, lastName }) => {
      if (!email || !password || !firstName || !username || !lastName) {
        throw new Error("All fields are required");
      }

      const fullname = `${firstName} ${lastName}`;

      try {
        const response = await mutation.mutateAsync({
          email,
          password,
          username,
          fullname,
        });

        // The response is already parsed JSON from httpClient
        return (response as unknown as RegisterResponse).token;
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
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

  const mutation = useMutation({ mutationFn: register });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md w-full max-w-4xl overflow-hidden">
        {/* Desktop Layout - 16:9 aspect ratio */}
        <div className="hidden lg:block">
          <div className="aspect-video flex">
            {/* Welcome Section - Left side */}
            <div className="w-1/3 bg-gradient-to-br from-green-500 to-green-600 p-6 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-white text-base font-semibold text-center mb-1">
                Create Account
              </h2>
              <p className="text-green-100 text-xs text-center opacity-90 mb-2">
                Join EatWhatNow
              </p>
              <p className="text-green-100 text-xs text-center opacity-80">
                Discover amazing restaurants
              </p>
            </div>

            {/* Form Section - Right side */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <h3 className="text-gray-800 text-sm font-semibold mb-4 pb-1 border-b-2 border-green-500 inline-block">
                  Create Account
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Choose a username"
                      value={credentials.username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your first name"
                      value={credentials.firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      value={credentials.lastName}
                      onChange={(e) => setLastName(e.target.value)}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Create a strong password"
                      value={credentials.password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 px-4 rounded-md transition-colors duration-200 mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </button>

                  {errors.message && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-xs">
                      {errors.message}
                    </div>
                  )}

                  {mutation.isSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-md text-xs">
                      Account created successfully! Please check your email.
                    </div>
                  )}
                </form>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 text-center">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-green-500 hover:text-green-600 font-medium"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Same theme as desktop */}
        <div className="block lg:hidden">
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-start` justify-center">
            <div className="bg-white rounded-lg shadow-md w-full max-w-sm overflow-hidden">
              {/* Header Section with green gradient */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-white text-base font-semibold mb-1">
                  Create Account
                </h2>
                <p className="text-green-100 text-xs opacity-90">
                  Join EatWhatNow and discover amazing restaurants
                </p>
              </div>

              {/* Form Section */}
              <div className="p-4">
                <h3 className="text-gray-800 text-sm font-semibold mb-3 pb-1 border-b-2 border-green-500 inline-block">
                  Create Account
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label
                      htmlFor="username-mobile"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username-mobile"
                      name="username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Choose a username"
                      value={credentials.username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="firstName-mobile"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName-mobile"
                      name="firstName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your first name"
                      value={credentials.firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName-mobile"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName-mobile"
                      name="lastName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your last name"
                      value={credentials.lastName}
                      onChange={(e) => setLastName(e.target.value)}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Create a strong password"
                      value={credentials.password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </button>

                  {errors.message && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-xs mt-2">
                      {errors.message}
                    </div>
                  )}

                  {mutation.isSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-md text-xs mt-2">
                      Account created successfully! Please check your email.
                    </div>
                  )}
                </form>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 text-center">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-green-500 hover:text-green-600 font-medium"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
