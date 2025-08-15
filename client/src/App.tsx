import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import About from "./components/About";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/home/Home";
import AuthLayout from "./layouts/AuthLayout";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/Header";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] =
    useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarExpanded(!isDesktopSidebarExpanded);
  };

  const closeDesktopSidebar = () => {
    setIsDesktopSidebarExpanded(false);
  };

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <div className="h-screen flex overflow-hidden">
          {/* Desktop sidebar - always visible on large screens */}
          <div className="hidden lg:block">
            <Sidebar
              isOpen={true}
              onClose={() => {}}
              isExpanded={isDesktopSidebarExpanded}
              onToggleExpanded={toggleDesktopSidebar}
              onCloseExpanded={closeDesktopSidebar}
            />
          </div>

          <div className="flex flex-col flex-1">
            {/* Header only on mobile/tablet */}
            <div className="lg:hidden">
              <Header onToggleSidebar={toggleSidebar} />
            </div>

            <main className="flex-1 pt-14 lg:pt-0 overflow-hidden">
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
          </div>

          {/* Mobile sidebar - overlay on small screens */}
          <div className="lg:hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          </div>
        </div>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
