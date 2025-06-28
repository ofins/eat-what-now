import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { login as loginAsync } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import "./Auth.css";

const Login = () => {
  const { login } = useAuth(); // Assuming useAuth is defined in your hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const navigate = useNavigate(); // Use useNavigate from react-router

  const mutation = useMutation({
    mutationFn: loginAsync,
    onSuccess: (data) => {
      login(data.token);
      console.log("Login successful:", data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="auth-container min-h-screen overflow-y-auto w-full flex items-start justify-center p-4 pb-20">
      <div className="auth-card p-8 md:p-10 w-[90%] max-w-2xl min-w-[300px] mt-4 mb-8">
        <div className="auth-header mb-8">
          <h2 className="auth-title text-2xl md:text-3xl mb-2">Welcome Back</h2>
          <p className="auth-subtitle text-base md:text-lg m-0">
            Sign in to continue your food journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="form-label text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input p-4 text-base"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="form-label text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input p-4 text-base"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button p-4 px-6 text-base mt-2"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <span className="loading-spinner">Signing in...</span>
            ) : (
              "Sign In"
            )}
          </button>

          {mutation.isError && (
            <div className="auth-error p-4 text-sm mt-2">
              {(mutation.error as Error).message}
            </div>
          )}

          {mutation.isSuccess && (
            <div className="auth-success p-4 text-sm mt-2">
              Login successful! Redirecting...
            </div>
          )}
        </form>

        <div className="auth-footer mt-8 pt-6">
          <p className="auth-link-text text-sm m-0">
            Don't have an account?
            <Link to="/register" className="auth-link ml-1">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
