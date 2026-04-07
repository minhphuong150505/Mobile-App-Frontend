import { Outlet, useLocation, Link } from "react-router";
import { Compass, Receipt, User, Bell } from "lucide-react";

export default function Root() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: Compass, label: "Discovery" },
    { path: "/transactions", icon: Receipt, label: "Giao dịch" },
    { path: "/profile", icon: User, label: "Cá nhân" },
    { path: "/notifications", icon: Bell, label: "Thông báo" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] max-w-[480px] mx-auto">
      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-[#0a0a0a] border-t border-gray-800 z-50">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 h-full"
              >
                <Icon
                  className="w-5 h-5 mb-1"
                  style={{ color: active ? "#FF8C42" : "#666666" }}
                />
                <span
                  className="text-[10px]"
                  style={{ color: active ? "#FF8C42" : "#666666" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}