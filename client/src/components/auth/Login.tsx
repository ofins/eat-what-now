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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue your food journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <span className="loading-spinner">Signing in...</span>
            ) : (
              "Sign In"
            )}
          </button>

          {mutation.isError && (
            <div className="auth-error">
              {(mutation.error as Error).message}
            </div>
          )}

          {mutation.isSuccess && (
            <div className="auth-success">Login successful! Redirecting...</div>
          )}
        </form>

        <div className="auth-footer">
          <p className="auth-link-text">
            Don't have an account?
            <Link to="/register" className="auth-link">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
