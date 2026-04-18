import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Package, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Order, Rental } from '@/services/api/orderApi';

export default function TransactionsScreen() {
  const router = useRouter();
  const { orders, rentals, loadOrders, loadRentals, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "rentals">("orders");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (user) {
        await loadOrders();
        await loadRentals();
      }
    } catch (e) {
      console.error('Error loading transactions:', e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string, color: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "shipping":
      case "shipped":
        return <Clock size={16} color={color} />;
      case "completed":
      case "delivered":
        return <CheckCircle size={16} color={color} />;
      case "pending":
        return <Package size={16} color={color} />;
      case "cancelled":
        return <XCircle size={16} color={color} />;
      default:
        return <Package size={16} color={color} />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "shipping":
      case "shipped":
        return { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", color: "#60a5fa" };
      case "completed":
      case "delivered":
        return { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400", color: "#4ade80" };
      case "pending":
        return { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400", color: "#facc15" };
      case "cancelled":
        return { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400", color: "#f87171" };
      default:
        return { bg: "bg-gray-500/20", border: "border-gray-500/30", text: "text-gray-400", color: "#9ca3af" };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  if (!user) {
    return (
      <View className="flex-1 bg-[#1a1a1a] items-center justify-center p-6">
        <Text className="text-white text-lg mb-4">Vui lòng đăng nhập để xem giao dịch</Text>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login' as any)}
          className="bg-[#FF8C42] px-6 py-3 rounded-full"
        >
          <Text className="text-black font-bold">Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 bg-[#1a1a1a] items-center justify-center">
        <ActivityIndicator size="large" color="#FF8C42" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      {/* Header */}
      <View className="px-6 pt-10 pb-4 bg-[#1a1a1a] z-10 w-full">
        <Text className="text-3xl mb-6 text-white font-bold tracking-tight">GIAO DỊCH</Text>

        {/* Tabs */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => setActiveTab("orders")}
            className={`flex-1 py-3 rounded-2xl items-center justify-center transition-all ${
              activeTab === "orders"
                ? "bg-[#FF8C42]"
                : "bg-[#0a0a0a] border border-gray-800"
            }`}
          >
            <Text className={activeTab === "orders" ? "text-black font-semibold" : "text-gray-400"}>Đơn hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("rentals")}
            className={`flex-1 py-3 rounded-2xl items-center justify-center transition-all ${
              activeTab === "rentals"
                ? "bg-[#FF8C42]"
                : "bg-[#0a0a0a] border border-gray-800"
            }`}
          >
            <Text className={activeTab === "rentals" ? "text-black font-semibold" : "text-gray-400"}>Đơn thuê</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="px-6 flex-1 pt-4">
        {activeTab === "orders" ? (
          <View className="space-y-4 pb-8">
            {orders.length === 0 ? (
              <View className="items-center py-12">
                <Text className="text-gray-400">Chưa có đơn hàng</Text>
              </View>
            ) : (
              orders.map((order) => {
                const statusStyle = getStatusStyle(order.status);
                const firstItem = order.orderItems[0];
                return (
                  <TouchableOpacity
                    key={order.orderId}
                    onPress={() => router.push(`/orders/${order.orderId}` as any)}
                    className="bg-[#0a0a0a] border border-gray-800 rounded-3xl overflow-hidden mb-4"
                  >
                    <View className="flex-row gap-4 p-4">
                      <View className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-800">
                        <Image
                          source={{ uri: firstItem?.imageUrl || undefined }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm text-white font-semibold mb-1" numberOfLines={1}>
                          {firstItem?.productName || `Order ${order.orderId.slice(0, 8)}`}
                        </Text>
                        <Text className="text-xs text-gray-500 mb-2">#{order.orderId.slice(0, 8)}</Text>
                        <View className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-full border self-start ${statusStyle.bg} ${statusStyle.border}`}>
                          {getStatusIcon(order.status, statusStyle.color)}
                          <Text className={`text-xs ml-1 ${statusStyle.text}`}>{order.status}</Text>
                        </View>
                      </View>
                    </View>
                    <View className="px-4 pb-4 mt-2">
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500 text-sm">Ngày đặt</Text>
                        <Text className="text-gray-300 text-sm">{formatDate(order.orderDate)}</Text>
                      </View>
                      <View className="flex-row justify-between items-end pt-2 border-t border-gray-800">
                        <Text className="text-gray-500 text-sm">Tổng cộng</Text>
                        <Text className="text-[#FF8C42] text-lg font-bold">₫{order.totalAmount.toLocaleString()}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        ) : (
          <View className="space-y-4 pb-8">
            {rentals.length === 0 ? (
              <View className="items-center py-12">
                <Text className="text-gray-400">Chưa có đơn thuê</Text>
              </View>
            ) : (
              rentals.map((rental) => {
                const statusStyle = getStatusStyle(rental.status);
                return (
                  <TouchableOpacity
                    key={rental.rentalId}
                    onPress={() => router.push(`/rentals/detail/${rental.rentalId}` as any)}
                    className="bg-[#0a0a0a] border border-gray-800 rounded-3xl overflow-hidden mb-4"
                  >
                    <View className="flex-row gap-4 p-4">
                      <View className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-800">
                        <Image
                          source={{ uri: rental.primaryImageUrl || undefined }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm text-white font-semibold mb-1" numberOfLines={1}>{rental.assetName}</Text>
                        <Text className="text-xs text-gray-500 mb-2">#{rental.rentalId.slice(0, 8)}</Text>
                        <View className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-full border self-start ${statusStyle.bg} ${statusStyle.border}`}>
                          {getStatusIcon(rental.status, statusStyle.color)}
                          <Text className={`text-xs ml-1 ${statusStyle.text}`}>{rental.status}</Text>
                        </View>
                      </View>
                    </View>
                    <View className="px-4 pb-4 mt-2">
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500 text-sm">Thời gian thuê</Text>
                        <View className="flex-row items-center">
                          <Calendar size={12} color="#d1d5db" />
                          <Text className="text-gray-300 text-sm ml-1">
                            {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500 text-sm">Daily Rate</Text>
                        <Text className="text-gray-300 text-sm">₫{(rental.totalRentFee / Math.max(1, Math.ceil((new Date(rental.endDate).getTime() - new Date(rental.startDate).getTime()) / (1000 * 60 * 60 * 24)))).toLocaleString()}</Text>
                      </View>
                      <View className="flex-row justify-between items-end pt-2 border-t border-gray-800">
                        <Text className="text-gray-500 text-sm">Total</Text>
                        <Text className="text-[#FF8C42] text-lg font-bold">₫{rental.totalRentFee.toLocaleString()}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
