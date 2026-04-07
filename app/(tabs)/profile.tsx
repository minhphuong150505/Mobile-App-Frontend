import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
} from 'lucide-react-native';

export default function ProfileScreen() {
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
    <ScrollView className="flex-1 bg-[#1a1a1a]">
      {/* Header */}
      <View className="bg-[#FF8C42] px-6 pt-12 pb-8">
        <View className="flex-row items-center gap-4 mb-6">
          <View className="w-20 h-20 rounded-full bg-black/20 border-2 border-white/20 items-center justify-center">
            <Text className="text-3xl">👤</Text>
          </View>
          <View className="flex-1">
            <Text className="text-2xl mb-1 tracking-tight text-white font-bold">Nguyễn Văn A</Text>
            <Text className="text-sm opacity-90 text-white">nguyenvana@email.com</Text>
            <Text className="text-xs opacity-75 mt-1 text-white">Member since 2024</Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <View
                key={stat.label}
                className="flex-1 bg-black/20 border border-white/20 rounded-2xl p-4 items-center"
              >
                <Icon size={20} color="white" className="mb-2" />
                <Text className="text-2xl mb-1 text-white font-bold mt-2">{stat.value}</Text>
                <Text className="text-[10px] opacity-90 uppercase tracking-wide text-white">{stat.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Menu Sections */}
      <View className="px-6 py-6 space-y-4">
        {menuItems.map((section) => (
          <View key={section.section} className="mb-6">
            <Text className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-2 font-semibold">
              {section.section}
            </Text>
            <View className="bg-[#0a0a0a] border border-gray-800 rounded-3xl overflow-hidden">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={item.path}
                    className={`w-full flex-row items-center gap-4 px-5 py-4 ${
                      index !== section.items.length - 1 ? "border-b border-gray-800" : ""
                    }`}
                  >
                    <View className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                      <Icon size={20} color="#9ca3af" />
                    </View>
                    <Text className="flex-1 text-left text-sm text-white font-medium">{item.label}</Text>
                    {item.badge && (
                      <View className="bg-[#FF8C42] px-2 py-0.5 rounded-full items-center justify-center">
                        <Text className="text-black text-xs font-semibold">{item.badge}</Text>
                      </View>
                    )}
                    <ChevronRight size={16} color="#4b5563" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <View className="pt-2">
          <TouchableOpacity className="w-full bg-[#0a0a0a] border border-gray-800 rounded-3xl px-5 py-4 flex-row items-center gap-4 mb-8">
            <View className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <LogOut size={20} color="#ef4444" />
            </View>
            <Text className="flex-1 text-left text-sm text-red-500 font-medium">Sign Out</Text>
            <ChevronRight size={16} color="rgba(239, 68, 68, 0.5)" />
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text className="text-center text-xs text-gray-600 pb-12">
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
