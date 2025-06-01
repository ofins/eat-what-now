import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mutation = useMutation({
    mutationFn: (variables: {
      endpoint: string;
      email: string;
      password: string;
    }) =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/${variables.endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: variables.email,
          password: variables.password,
        }),
      }).then(async (res) => {
        if (!res.ok) throw new Error("Login failed");
        const data = await res.json();
        // Optionally save token here if your API returns it in the body:
        localStorage.setItem("token", data.token || "");
        console.log("Login successful:", data);
        return data;
      }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ endpoint: "auth/login", email, password });
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={mutation.isPending}>
          Login
        </button>
        {mutation.isPending && <p>Logging in...</p>}
        {mutation.isError && (
          <p style={{ color: "red" }}>{(mutation.error as Error).message}</p>
        )}
        {mutation.isSuccess && (
          <p style={{ color: "green" }}>Login successful!</p>
        )}
      </form>
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default Login;
