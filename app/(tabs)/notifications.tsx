import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Package, Bell, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react-native';

export default function NotificationsScreen() {
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

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "order":
        return { bg: "bg-blue-500/20", border: "border-blue-500/30", color: "#60a5fa" };
      case "rental":
        return { bg: "bg-[#FF8C42]/20", border: "border-[#FF8C42]/30", color: "#FF8C42" };
      case "system":
        return { bg: "bg-purple-500/20", border: "border-purple-500/30", color: "#c084fc" };
      default:
        return { bg: "bg-gray-500/20", border: "border-gray-500/30", color: "#9ca3af" };
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      {/* Header */}
      <View className="px-6 pt-10 pb-4 bg-[#1a1a1a] z-10 w-full">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-3xl text-white font-bold tracking-tight">NOTIFICATIONS</Text>
          {unreadCount > 0 && (
            <View className="bg-[#FF8C42] px-2.5 py-1 rounded-full">
              <Text className="text-black text-xs font-semibold">{unreadCount} new</Text>
            </View>
          )}
        </View>
        <Text className="text-sm text-gray-400">Stay updated with your orders and rentals</Text>
      </View>

      {/* Notifications List */}
      <ScrollView className="px-6 flex-1 pt-2">
        <View className="space-y-3 pb-8">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            const style = getTypeStyle(notification.type);

            return (
              <View
                key={notification.id}
                className={`bg-[#0a0a0a] border rounded-3xl p-4 mb-3 transition-all ${notification.read
                    ? "border-gray-800"
                    : "border-gray-700"
                  }`}
              >
                <View className="flex-row gap-4">
                  <View
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${style.bg} ${style.border}`}
                  >
                    <Icon size={20} color={style.color} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-start justify-between mb-1">
                      <Text
                        className={`text-sm tracking-tight w-11/12 font-semibold ${notification.read ? "text-gray-400" : "text-white"
                          }`}
                      >
                        {notification.title}
                      </Text>
                      {!notification.read && (
                        <View className="w-2 h-2 bg-[#FF8C42] rounded-full mt-1.5"></View>
                      )}
                    </View>
                    <Text
                      className={`text-sm mb-2 leading-relaxed ${notification.read ? "text-gray-600" : "text-gray-400"
                        }`}
                    >
                      {notification.message}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-xs text-gray-600">{notification.time}</Text>
                      {!notification.read && (
                        <TouchableOpacity>
                          <Text className="text-xs text-[#FF8C42]">Mark as read</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Mark all as read */}
          {unreadCount > 0 && (
            <View className="mt-4 pb-4 items-center">
              <TouchableOpacity>
                <Text className="text-sm text-gray-400 font-medium">Mark all as read</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
