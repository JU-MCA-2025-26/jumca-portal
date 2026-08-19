import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.tsx";
import Topbar from "./Topbar.tsx";

function DashboardLayout() {
  return (
    <div className="flex h-dvh bg-bg font-mono text-text">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
