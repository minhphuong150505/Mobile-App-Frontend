import {
  User,
  Heart,
  Package,
  Settings,
  Bell,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Star,
  Camera,
  Award,
} from "lucide-react";

export default function Profile() {
  const stats = [
    { label: "Orders", value: "12", icon: Package },
    { label: "Rentals", value: "8", icon: Camera },
    { label: "Rating", value: "4.9", icon: Star },
  ];

  const menuItems = [
    {
      section: "Account",
      items: [
        { icon: User, label: "Personal Information", path: "/profile/info" },
        { icon: Heart, label: "Favorites", path: "/profile/favorites", badge: "8" },
        { icon: Award, label: "My Equipment", path: "/profile/my-equipment" },
      ],
    },
    {
      section: "Settings",
      items: [
        { icon: Settings, label: "Account Settings", path: "/settings/account" },
        { icon: Bell, label: "Notifications", path: "/settings/notifications", badge: "3" },
        { icon: Shield, label: "Privacy & Security", path: "/settings/security" },
        { icon: HelpCircle, label: "Help & Support", path: "/help" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] px-6 pt-8 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-black/20 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center text-3xl">
            👤
          </div>
          <div className="flex-1">
            <h2 className="text-2xl mb-1 tracking-tight">Nguyễn Văn A</h2>
            <p className="text-sm opacity-90">nguyenvana@email.com</p>
            <p className="text-xs opacity-75 mt-1">Member since 2024</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center"
              >
                <Icon className="w-5 h-5 mx-auto mb-2" />
                <div className="text-2xl mb-1">{stat.value}</div>
                <div className="text-[10px] opacity-90 uppercase tracking-wide">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-6 py-6 space-y-4">
        {menuItems.map((section) => (
          <div key={section.section}>
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-2">
              {section.section}
            </h3>
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl overflow-hidden">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-900/50 transition-colors ${
                      index !== section.items.length - 1 ? "border-b border-gray-800" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="bg-[#FF8C42] text-black text-xs px-2 py-0.5 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="pt-2">
          <button className="w-full bg-[#0a0a0a] border border-gray-800 rounded-3xl px-5 py-4 flex items-center gap-4 hover:bg-gray-900/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="flex-1 text-left text-sm text-red-500">Sign Out</span>
            <ChevronRight className="w-4 h-4 text-red-500/50" />
          </button>
        </div>

        {/* Version */}
        <div className="text-center text-xs text-gray-600 py-6">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
}