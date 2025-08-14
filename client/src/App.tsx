import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import About from "./components/About";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/home/Home";
import AuthLayout from "./layouts/AuthLayout";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Search from "./components/Search";
import Sidebar from "./components/Sidebar";

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
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <main className="h-screen overflow-y-auto pb-16 md:pb-0">
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
              path="search"
              element={
                <ProtectedRoute>
                  <Search />
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
        <Sidebar />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
