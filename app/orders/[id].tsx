import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Package, MapPin, Calendar, Clock, Truck, CheckCircle } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ORDERS } from '@/constants/mockData';

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const stringId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
  
  const order = ORDERS.find(o => o.orderId === stringId);

  if (!order) {
    return (
      <View className="flex-1 bg-[#1a1a1a] items-center justify-center">
        <Text className="text-white">Order not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-4 py-2 bg-[#FF8C42] rounded-full">
          <Text className="text-black font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const steps = [
    { id: 1, title: 'Order Placed', desc: 'We have received your order', icon: Clock, stepIndex: 0 },
    { id: 2, title: 'Processing', desc: 'Your items are being packed', icon: Package, stepIndex: 1 },
    { id: 3, title: 'Shipped', desc: 'Your order is on the way', icon: Truck, stepIndex: 2 },
    { id: 4, title: 'Delivered', desc: 'The order has been handed to you', icon: CheckCircle, stepIndex: 3 },
  ];

  const isStepCompleted = (stepIndex: number) => {
    if (order.status === 'DELIVERED') return true;
    if (order.status === 'SHIPPED' && stepIndex <= 2) return true;
    if (order.status === 'PENDING' && stepIndex <= 1) return true;
    if (stepIndex === 0) return true;
    return false;
  };

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      <View className="px-6 pt-16 pb-4 flex-row items-center border-b border-gray-800 bg-[#1a1a1a]">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-white font-bold flex-1">Order Details</Text>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5 mb-4">
          <View className="flex-row items-center justify-between mb-4 border-b border-gray-800 pb-4">
            <Text className="text-gray-400 font-medium">Order ID</Text>
            <Text className="text-white font-bold">#{order.orderId}</Text>
          </View>
          
          <View className="flex-row items-center justify-between mb-4">
             <View className="flex-row items-center">
                <Calendar color="#4b5563" size={16} className="mr-2" />
                <Text className="text-gray-400 text-sm">Order Date</Text>
             </View>
             <Text className="text-white text-sm">{new Date(order.orderDate).toLocaleDateString()}</Text>
          </View>

          <View className="flex-row items-center justify-between mb-4">
             <View className="flex-row items-center">
                <Package color="#4b5563" size={16} className="mr-2" />
                <Text className="text-gray-400 text-sm">Status</Text>
             </View>
             <View className={`px-2 py-1 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                <Text className={`text-xs font-bold ${order.status === 'DELIVERED' ? 'text-green-500' : 'text-yellow-500'}`}>{order.status}</Text>
             </View>
          </View>

          <View className="flex-row justify-between pt-4 border-t border-gray-800">
             <Text className="text-white font-bold">Total Amount</Text>
             <Text className="text-[#FF8C42] font-bold text-lg">₫{order.totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        <View className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5 mb-4">
          <Text className="text-white font-bold mb-4">Shipping Address</Text>
          <View className="flex-row items-start">
             <MapPin color="#FF8C42" size={20} className="mr-3" />
             <Text className="text-gray-300 flex-1 leading-relaxed">{order.shippingAddress}</Text>
          </View>
        </View>

        <View className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5 mb-8">
          <Text className="text-white font-bold mb-6">Delivery Tracking</Text>
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
      </ScrollView>
    </View>
  );
}
