import { Package, Bell, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "order",
      icon: Package,
      title: "Order Delivered",
      message: "Your order ORD-2024-001 has been delivered successfully",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "rental",
      icon: AlertCircle,
      title: "Rental Reminder",
      message: "Your rental for Leica M11 ends in 2 days. Return by Apr 5, 2026",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "system",
      icon: TrendingUp,
      title: "New Arrivals",
      message: "Check out the latest Hasselblad cameras now available",
      time: "1 day ago",
      read: false,
    },
    {
      id: 4,
      type: "order",
      icon: CheckCircle,
      title: "Payment Confirmed",
      message: "Payment for Sony A7 III has been confirmed",
      time: "2 days ago",
      read: true,
    },
    {
      id: 5,
      type: "system",
      icon: Bell,
      title: "Special Offer",
      message: "Summer sale now live! Up to 30% off on selected items",
      time: "3 days ago",
      read: true,
    },
    {
      id: 6,
      type: "rental",
      icon: CheckCircle,
      title: "Rental Completed",
      message: "Thank you for returning Hasselblad X2D on time",
      time: "5 days ago",
      read: true,
    },
    {
      id: 7,
      type: "order",
      icon: Package,
      title: "Order Shipped",
      message: "Your order ORD-2024-002 is on the way",
      time: "1 week ago",
      read: true,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-500/20 border-blue-500/30";
      case "rental":
        return "bg-[#FF8C42]/20 border-[#FF8C42]/30";
      case "system":
        return "bg-purple-500/20 border-purple-500/30";
      default:
        return "bg-gray-500/20 border-gray-500/30";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-blue-400";
      case "rental":
        return "text-[#FF8C42]";
      case "system":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 sticky top-0 bg-[#1a1a1a] z-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl tracking-tight">NOTIFICATIONS</h1>
          {unreadCount > 0 && (
            <div className="bg-[#FF8C42] text-black text-xs px-2.5 py-1 rounded-full font-medium">
              {unreadCount} new
            </div>
          )}
        </div>
        <p className="text-sm text-gray-400">Stay updated with your orders and rentals</p>
      </div>

      {/* Notifications List */}
      <div className="px-6 pb-8">
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`bg-[#0a0a0a] border rounded-3xl p-4 transition-all ${
                  notification.read
                    ? "border-gray-800"
                    : "border-gray-700 shadow-lg shadow-[#FF8C42]/5"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${getTypeColor(
                      notification.type
                    )}`}
                  >
                    <Icon className={`w-5 h-5 ${getIconColor(notification.type)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3
                        className={`text-sm ${
                          notification.read ? "text-gray-400" : "text-white"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#FF8C42] rounded-full flex-shrink-0 mt-1.5"></div>
                      )}
                    </div>
                    <p
                      className={`text-sm mb-2 leading-relaxed ${
                        notification.read ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{notification.time}</span>
                      {!notification.read && (
                        <button className="text-xs text-[#FF8C42] hover:underline">
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mark all as read */}
        {unreadCount > 0 && (
          <div className="mt-6 text-center">
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
