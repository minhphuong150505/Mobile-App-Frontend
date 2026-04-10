import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { ArrowLeft, CreditCard, Wallet, Truck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { PRODUCTS, ASSETS } from '@/constants/mockData';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, clearCart, user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      let price = 0;
      if (item.type === 'PRODUCT') {
        const product = PRODUCTS.find(p => p.productId === item.id);
        price = product?.price || 0;
      } else {
        const asset = ASSETS.find(a => a.assetId === item.id);
        price = asset?.dailyRate || 0;
      }
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const handlePlaceOrder = () => {
    // Navigate strictly to order-status and clear cart to simulate successful placement
    clearCart();
    router.replace('/order-status' as any);
  };

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      {/* Header */}
      <View className="px-6 pt-16 pb-4 flex-row items-center border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-white font-bold flex-1">Checkout</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4 pb-20">
        <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Shipping Details</Text>
        <View className="space-y-3 mb-8">
           <TextInput
              placeholder="Full Name"
              placeholderTextColor="#6b7280"
              defaultValue={user?.userName}
              className="w-full bg-[#0a0a0a] text-white px-5 py-4 rounded-2xl border border-gray-800"
            />
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#6b7280"
              keyboardType="phone-pad"
              className="w-full bg-[#0a0a0a] text-white px-5 py-4 rounded-2xl border border-gray-800"
            />
            <TextInput
              placeholder="Full Delivery Address"
              placeholderTextColor="#6b7280"
              multiline
              className="w-full bg-[#0a0a0a] text-white px-5 py-4 rounded-2xl border border-gray-800 h-24"
              textAlignVertical="top"
            />
        </View>

        <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Payment Method</Text>
        <View className="space-y-3 mb-8">
           <TouchableOpacity 
             onPress={() => setPaymentMethod('cod')}
             className={`w-full flex-row items-center px-5 py-4 rounded-2xl border ${paymentMethod === 'cod' ? 'bg-[#FF8C42]/10 border-[#FF8C42]' : 'bg-[#0a0a0a] border-gray-800'}`}
           >
              <Wallet size={20} color={paymentMethod === 'cod' ? '#FF8C42' : '#9ca3af'} />
              <Text className={`ml-3 font-semibold ${paymentMethod === 'cod' ? 'text-white' : 'text-gray-400'}`}>Cash on Delivery</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             onPress={() => setPaymentMethod('card')}
             className={`w-full flex-row items-center px-5 py-4 rounded-2xl border ${paymentMethod === 'card' ? 'bg-[#FF8C42]/10 border-[#FF8C42]' : 'bg-[#0a0a0a] border-gray-800'}`}
           >
              <CreditCard size={20} color={paymentMethod === 'card' ? '#FF8C42' : '#9ca3af'} />
              <Text className={`ml-3 font-semibold ${paymentMethod === 'card' ? 'text-white' : 'text-gray-400'}`}>Credit/Debit Card</Text>
           </TouchableOpacity>
        </View>

        <View className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-5 mb-8">
           <View className="flex-row justify-between items-center mb-3">
             <Text className="text-gray-400">Subtotal</Text>
             <Text className="text-white font-medium">₫{totalPrice.toLocaleString()}</Text>
           </View>
           <View className="flex-row justify-between items-center mb-3">
             <Text className="text-gray-400">Shipping (Mock Location)</Text>
             <Text className="text-white font-medium">₫35,000</Text>
           </View>
           <View className="border-t border-gray-800 pt-3 mt-1 flex-row justify-between items-center">
             <Text className="text-white font-bold text-lg">Total</Text>
             <Text className="text-[#FF8C42] font-bold text-2xl tracking-tight">₫{(totalPrice + 35000).toLocaleString()}</Text>
           </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-gray-800 px-6 pt-4 pb-8">
        <TouchableOpacity 
          onPress={handlePlaceOrder}
          className="w-full bg-[#FF8C42] py-4 rounded-2xl items-center shadow shadow-orange-500/20"
        >
          <Text className="text-black font-bold text-lg">Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
