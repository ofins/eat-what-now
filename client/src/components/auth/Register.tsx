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
    <div className="auth-container min-h-scree w-full flex items-start justify-center p-4 pb-20">
      <div className="auth-card p-8 md:p-10 w-[90%] max-w-2xl min-w-[300px] mt-4 mb-8 h-fit">
        <div className="auth-header">
          <h2 className="auth-title text-2xl md:text-3xl mb-2">
            Create Account
          </h2>
          <p className="auth-subtitle text-base md:text-lg m-0">
            Join EatWhatNow and discover amazing restaurants
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="h-78 overflow-y-auto">
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="form-label text-sm mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input p-2 text-base"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="form-label text-sm mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input p-2 text-base"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="fullname" className="form-label text-sm mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                className="form-input p-2 text-base"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
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
                className="form-input p-2 text-base"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-button p-4 px-6 text-base mt-2"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <span className="loading-spinner">Creating Account...</span>
            ) : (
              "Create Account"
            )}
          </button>

          {mutation.isError && (
            <div className="auth-error p-4 text-sm mt-2">
              {(mutation.error as Error).message}
            </div>
          )}

          {mutation.isSuccess && (
            <div className="auth-success p-4 text-sm mt-2">
              Account created successfully! Please check your email.
            </div>
          )}
        </form>

        <div className="auth-footer mt-4 pt-4">
          <p className="auth-link-text text-sm m-0">
            Already have an account?
            <Link to="/login" className="auth-link ml-1">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
