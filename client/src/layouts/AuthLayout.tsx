import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      {/* You can add a logo or header here */}
      <Outlet />
    </div>
  );
}
