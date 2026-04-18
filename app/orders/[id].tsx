import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowLeft, Package, MapPin, Calendar, Clock, Truck, CheckCircle, XCircle } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { orderApi, Order } from '@/services/api/orderApi';

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { orders, token } = useAuth();
  const stringId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = orders.find(o => o.orderId === stringId);
    if (cached) {
      setOrder(cached);
      setLoading(false);
    } else if (token) {
      orderApi.getOrderById(token, stringId)
        .then(data => setOrder(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [stringId, token]);

  if (loading) {
    return (
      <View className="flex-1 bg-[#1a1a1a] items-center justify-center">
        <ActivityIndicator size="large" color="#FF8C42" />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 bg-[#1a1a1a] items-center justify-center">
        <Text className="text-white">Không tìm thấy đơn hàng.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-4 py-2 bg-[#FF8C42] rounded-full">
          <Text className="text-black font-bold">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const steps = [
    { id: 1, title: 'Đã đặt hàng', desc: 'Chúng tôi đã nhận được đơn hàng của bạn', icon: Clock, stepIndex: 0 },
    { id: 2, title: 'Đang xử lý', desc: 'Sản phẩm đang được đóng gói', icon: Package, stepIndex: 1 },
    { id: 3, title: 'Đang giao', desc: 'Đơn hàng đang trên đường giao', icon: Truck, stepIndex: 2 },
    { id: 4, title: 'Đã giao', desc: 'Đơn hàng đã được giao thành công', icon: CheckCircle, stepIndex: 3 },
  ];

  const isStepCompleted = (stepIndex: number) => {
    if (order.status === 'DELIVERED') return true;
    if (order.status === 'SHIPPED' && stepIndex <= 2) return true;
    if (order.status === 'CANCELLED') return stepIndex === 0;
    if (order.status === 'PENDING' && stepIndex <= 0) return true;
    if (stepIndex === 0) return true;
    return false;
  };

  const statusColor = order.status === 'DELIVERED' ? 'green' : order.status === 'CANCELLED' ? 'red' : 'yellow';

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      <View className="px-6 pt-16 pb-4 flex-row items-center border-b border-gray-800 bg-[#1a1a1a]">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 w-11 h-11 items-center justify-center">
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-white font-bold flex-1">Chi tiết đơn hàng</Text>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5 mb-4">
          <View className="flex-row items-center justify-between mb-4 border-b border-gray-800 pb-4">
            <Text className="text-gray-400 font-medium">Mã đơn hàng</Text>
            <Text className="text-white font-bold">#{order.orderId.slice(0, 8)}</Text>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Calendar color="#4b5563" size={16} style={{ marginRight: 8 }} />
              <Text className="text-gray-400 text-sm">Ngày đặt</Text>
            </View>
            <Text className="text-white text-sm">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</Text>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Package color="#4b5563" size={16} style={{ marginRight: 8 }} />
              <Text className="text-gray-400 text-sm">Trạng thái</Text>
            </View>
            <View className={`px-2 py-1 rounded-full ${statusColor === 'green' ? 'bg-green-500/20' : statusColor === 'red' ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
              <Text className={`text-xs font-bold ${statusColor === 'green' ? 'text-green-500' : statusColor === 'red' ? 'text-red-500' : 'text-yellow-500'}`}>
                {order.status === 'PENDING' ? 'Chờ xác nhận' : order.status === 'SHIPPED' ? 'Đang giao' : order.status === 'DELIVERED' ? 'Đã giao' : 'Đã hủy'}
              </Text>
            </View>
          </View>

          {order.orderItems && order.orderItems.length > 0 && (
            <View className="border-t border-gray-800 pt-4 mb-4">
              <Text className="text-white font-bold mb-3">Sản phẩm</Text>
              {order.orderItems.map((item, idx) => (
                <View key={idx} className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-300 text-sm flex-1">{item.productName} x{item.quantity}</Text>
                  <Text className="text-white text-sm">₫{(item.priceAtPurchase * item.quantity).toLocaleString()}</Text>
                </View>
              ))}
            </View>
          )}

          <View className="flex-row justify-between pt-4 border-t border-gray-800">
            <Text className="text-white font-bold">Tổng cộng</Text>
            <Text className="text-[#FF8C42] font-bold text-lg">₫{order.totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        <View className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5 mb-4">
          <Text className="text-white font-bold mb-4">Địa chỉ giao hàng</Text>
          <View className="flex-row items-start">
            <MapPin color="#FF8C42" size={20} style={{ marginRight: 12 }} />
            <Text className="text-gray-300 flex-1 leading-relaxed">{order.shippingAddress}</Text>
          </View>
        </View>

        {order.status !== 'CANCELLED' && (
          <View className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5 mb-8">
            <Text className="text-white font-bold mb-6">Theo dõi giao hàng</Text>
            <View className="space-y-0">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;
                const completed = isStepCompleted(step.stepIndex);

                return (
                  <View key={step.id} className="flex-row items-start relative opacity-100">
                    {!isLast && (
                      <View className={`absolute left-5 top-10 bottom-[-20px] w-0.5 ${completed ? 'bg-[#FF8C42]' : 'bg-gray-800'}`} />
                    )}
                    <View className={`w-10 h-10 rounded-full items-center justify-center z-10 ${completed ? 'bg-[#FF8C42]' : 'bg-gray-800'}`}>
                      <Icon size={18} color={completed ? 'black' : '#9ca3af'} />
                    </View>
                    <View className="ml-4 pb-10 flex-1">
                      <Text className={`font-bold ${completed ? 'text-white' : 'text-gray-500'}`}>{step.title}</Text>
                      <Text className={`${completed ? 'text-gray-400' : 'text-gray-600'} text-xs mt-1`}>{step.desc}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {order.status === 'CANCELLED' && (
          <View className="bg-[#0a0a0a] border border-red-500/20 rounded-2xl p-5 mb-8 items-center">
            <XCircle size={40} color="#ef4444" />
            <Text className="text-red-500 font-bold text-lg mt-2">Đơn hàng đã hủy</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}