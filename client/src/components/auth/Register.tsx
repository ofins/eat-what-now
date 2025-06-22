import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { register } from "../../api/auth";
import "./Auth.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");

  const mutation = useMutation({ mutationFn: register });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, email, password, fullname });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">
            Join EatWhatNow and discover amazing restaurants
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
            <label htmlFor="fullname" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              className="form-input"
              placeholder="Enter your full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
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
              placeholder="Create a strong password"
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
              <span className="loading-spinner">Creating Account...</span>
            ) : (
              "Create Account"
            )}
          </button>

          {mutation.isError && (
            <div className="auth-error">
              {(mutation.error as Error).message}
            </div>
          )}

          {mutation.isSuccess && (
            <div className="auth-success">
              Account created successfully! Please check your email.
            </div>
          )}
        </form>

        <div className="auth-footer">
          <p className="auth-link-text">
            Already have an account?
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
