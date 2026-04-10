import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { PRODUCTS, ASSETS, getPrimaryImage } from '@/constants/mockData';

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useAuth();

  const enrichedCart = useMemo(() => {
    return cartItems.map(item => {
      let title = '';
      let price = 0;
      let imgUrl = getPrimaryImage(item.id, item.type);

      if (item.type === 'PRODUCT') {
        const product = PRODUCTS.find(p => p.productId === item.id);
        title = product?.productName || 'Unknown Product';
        price = product?.price || 0;
      } else {
        const asset = ASSETS.find(a => a.assetId === item.id);
        title = asset?.modelName || 'Unknown Asset';
        price = asset?.dailyRate || 0;
      }

      return {
        ...item,
        title,
        price,
        imgUrl
      };
    });
  }, [cartItems]);

  const totalPrice = enrichedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (enrichedCart.length === 0) return;
    router.push('/checkout' as any);
  };

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      {/* Header */}
      <View className="px-6 pt-16 pb-4 flex-row items-center border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-white font-bold flex-1">My Cart</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={() => clearCart()}>
            <Text className="text-red-500 font-semibold">Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {cartItems.length === 0 ? (
        <View className="flex-1 justify-center items-center p-6">
          <View className="w-24 h-24 rounded-full bg-black/20 border border-gray-800 items-center justify-center mb-6">
            <ShoppingBag size={40} color="#4b5563" />
          </View>
          <Text className="text-xl text-white font-bold mb-2">Your cart is empty</Text>
          <Text className="text-gray-400 text-center mb-8">
            Looks like you haven't added any equipment to your cart yet.
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/store' as any)}
            className="bg-[#FF8C42] px-8 py-4 rounded-full"
          >
            <Text className="text-black font-bold">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView className="flex-1 py-4">
            {enrichedCart.map((item) => (
              <View 
                key={`${item.type}-${item.id}`} 
                className="mx-6 mb-4 bg-[#0a0a0a] rounded-3xl p-4 border border-gray-800 flex-row items-center"
              >
                <Image 
                  source={{ uri: item.imgUrl }} 
                  className="w-20 h-20 rounded-2xl bg-black" 
                  resizeMode="contain"
                />
                <View className="flex-1 ml-4 justify-center">
                  <Text className="text-[10px] text-gray-500 uppercase mb-1 font-bold">{item.type}</Text>
                  <Text className="text-white font-bold mb-1" numberOfLines={2}>{item.title}</Text>
                  <Text className="text-[#FF8C42] font-semibold mb-3">
                    ₫{item.price.toLocaleString()} {item.type === 'ASSET' ? '/day' : ''}
                  </Text>
                  
                  {/* Quantity controls */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center bg-[#1a1a1a] rounded-full border border-gray-800">
                      <TouchableOpacity 
                        className="w-8 h-8 items-center justify-center"
                        onPress={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeFromCart(item.id)}
                      >
                        <Minus size={14} color="white" />
                      </TouchableOpacity>
                      <Text className="text-white font-semibold flex-1 text-center min-w-[24px]">
                        {item.quantity}
                      </Text>
                      <TouchableOpacity 
                        className="w-8 h-8 items-center justify-center"
                        onPress={() => updateQuantity(item.id, 1)}
                      >
                        <Plus size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                      onPress={() => removeFromCart(item.id)}
                      className="w-8 h-8 rounded-full bg-red-500/10 items-center justify-center"
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Bottom Checkout Bar */}
          <View className="bg-[#0a0a0a] border-t border-gray-800 px-6 pt-6 pb-10 rounded-t-3xl shadow-lg">
            <View className="flex-row justify-between items-end mb-4">
              <Text className="text-gray-400 font-semibold">Total Price</Text>
              <Text className="text-3xl font-bold text-white tracking-tight">₫{totalPrice.toLocaleString()}</Text>
            </View>
            <TouchableOpacity 
              onPress={handleCheckout}
              className="w-full bg-[#FF8C42] py-4 rounded-2xl items-center shadow shadow-orange-500/20"
            >
              <Text className="text-black font-bold text-lg">Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
