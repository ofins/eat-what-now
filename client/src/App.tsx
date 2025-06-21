import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import About from "./components/About";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/home/Home";
import AuthLayout from "./layouts/AuthLayout";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/${queryKey[0]}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      },
    },
    mutations: {
      // Default mutationFn expects only 'variables' as argument
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutationFn: async (variables: any) => {
        const { endpoint, ...body } = variables;
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/${endpoint}`, // Replace with your default endpoint or use a custom hook for dynamic endpoints
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(body),
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      },
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <main className="h-screen flex justify-center items-center">
          <Routes>
            <Route index element={<Home />} />
            <Route
              path="about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />

            <Route
              element={
                <ProtectedRoute requireAuth={false} redirectTo="/">
                  <AuthLayout />
                </ProtectedRoute>
              }
            >
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
