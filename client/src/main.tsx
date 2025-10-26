import { AuthProvider, GoogleOAuthProvider } from "@ofins/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider
      authOptions={{
        refreshToken: false,
        endpoints: { login: "/auth/login", user: "/users/profile" },
        baseUrl: import.meta.env.VITE_API_BASE_URL,
      }}
    >
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </AuthProvider>
  </StrictMode>
);
