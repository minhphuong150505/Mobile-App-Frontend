import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { ArrowLeft, Heart, Shield, Plus, Minus, Calendar, Star } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { productApi, assetApi, Product, Asset } from '@/services/api/productApi';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EquipmentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user, toggleFavorite, addToCart } = useAuth();

  const stringId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

  const [equipment, setEquipment] = useState<(Product & { type: 'PRODUCT' }) | (Asset & { type: 'ASSET' }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Rental date states
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 24 * 60 * 60 * 1000)); // +1 day
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    loadEquipment();
  }, [stringId]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load as product first
      try {
        const product = await productApi.getProductById(stringId);
        setEquipment({ ...product, type: 'PRODUCT' });
        return;
      } catch (e) {
        // Not a product, try asset
      }

      // Load as asset
      const asset = await assetApi.getAssetById(stringId);
      setEquipment({ ...asset, type: 'ASSET' });
    } catch (e: any) {
      setError(e.message || 'Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user || !equipment) {
      router.push('/(auth)/login' as any);
      return;
    }
    await toggleFavorite(equipment.type === 'PRODUCT' ? equipment.productId : equipment.assetId, equipment.type);
    setIsFavorite(!isFavorite);
  };

  // Calculate rental days and total
  const calculateRentalDays = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const calculateRentalTotal = () => {
    if (!equipment || equipment.type !== 'ASSET') return 0;
    const days = calculateRentalDays();
    return (equipment as Asset).dailyRate * days;
  };

  const handleAddToCart = async () => {
    if (!user || !equipment) {
      router.push('/(auth)/login' as any);
      return;
    }

    try {
      const itemId = equipment.type === 'PRODUCT' ? equipment.productId : equipment.assetId;
      await addToCart(itemId, equipment.type, equipment.type === 'PRODUCT' ? quantity : 1);
      Alert.alert('Success', `${equipment.type === 'PRODUCT' ? equipment.productName : equipment.modelName} has been added to your cart.`);
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!user || !equipment || equipment.type !== 'PRODUCT') {
      router.push('/(auth)/login' as any);
      return;
    }

    // Navigate directly to checkout with product info
    const checkoutData = {
      type: 'BUY_NOW',
      items: [{
        id: equipment.productId,
        type: 'PRODUCT' as const,
        name: equipment.productName,
        price: equipment.price,
        quantity: quantity,
        imageUrl: equipment.primaryImageUrl,
      }],
      total: equipment.price * quantity,
    };

    // Navigate to checkout with params
    router.push({
      pathname: '/checkout' as any,
      params: { data: JSON.stringify(checkoutData) },
    });
  };

  const handleRentNow = async () => {
    if (!user || !equipment || equipment.type !== 'ASSET') {
      router.push('/(auth)/login' as any);
      return;
    }

    // Validate dates
    if (startDate >= endDate) {
      Alert.alert('Invalid Dates', 'Return date must be after start date');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      Alert.alert('Invalid Date', 'Start date cannot be in the past');
      return;
    }

    // Navigate directly to rental checkout
    const rentalDays = calculateRentalDays();
    const totalAmount = calculateRentalTotal();

    const checkoutData = {
      type: 'RENT_NOW',
      items: [{
        id: equipment.assetId,
        type: 'ASSET' as const,
        name: equipment.modelName,
        price: (equipment as Asset).dailyRate,
        quantity: 1,
        imageUrl: equipment.primaryImageUrl,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        rentalDays: rentalDays,
      }],
      total: totalAmount,
      rentalInfo: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        days: rentalDays,
      },
    };

    router.push({
      pathname: '/checkout' as any,
      params: { data: JSON.stringify(checkoutData) },
    });
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      const minDate = new Date();
      minDate.setHours(0, 0, 0, 0);
      if (selectedDate < minDate) {
        Alert.alert('Invalid Date', 'Cannot select a date in the past');
        return;
      }
      setStartDate(selectedDate);
      // Ensure end date is at least 1 day after start date
      if (selectedDate >= endDate) {
        const newEndDate = new Date(selectedDate);
        newEndDate.setDate(newEndDate.getDate() + 1);
        setEndDate(newEndDate);
      }
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      if (selectedDate <= startDate) {
        Alert.alert('Invalid Date', 'Return date must be after start date');
        return;
      }
      setEndDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#1a1a1a] items-center justify-center">
        <ActivityIndicator size="large" color="#FF8C42" />
      </View>
    );
  }

  if (error || !equipment) {
    return (
      <View className="flex-1 bg-[#1a1a1a] items-center justify-center">
        <Text className="text-white mb-4">{error || 'Equipment not found'}</Text>
        <TouchableOpacity onPress={() => router.back()} className="px-4 py-2 bg-[#FF8C42] rounded-full">
          <Text className="text-black font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isProduct = equipment.type === 'PRODUCT';
  const itemId = isProduct ? equipment.productId : equipment.assetId;
  const title = isProduct ? equipment.productName : equipment.modelName;
  const price = isProduct ? equipment.price : equipment.dailyRate;
  const status = (equipment as Asset).status;

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Header */}
        <View className="relative">
          <View className="aspect-square bg-black w-full border-b border-gray-800">
            <Image
              source={{ uri: equipment.primaryImageUrl }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>

          {/* Top Actions */}
          <View className="absolute top-12 left-0 right-0 px-4 flex-row justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center border border-white/10"
            >
              <ArrowLeft size={20} color="white" />
            </TouchableOpacity>
            <View className="flex-row gap-2">
               <TouchableOpacity
                onPress={handleToggleFavorite}
                className={`w-10 h-10 rounded-full flex items-center justify-center border ${isFavorite ? 'bg-[#FF8C42] border-[#FF8C42]' : 'bg-black/40 border-white/20'}`}
              >
                <Heart size={20} color={isFavorite ? 'black' : 'white'} fill={isFavorite ? 'black' : 'none'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Badge */}
          <View className="absolute bottom-4 left-4">
            <View className="bg-[#FF8C42] px-3 py-1.5 rounded-full">
              <Text className="text-black text-xs font-bold uppercase">{equipment.type}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 py-6 space-y-4">
          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">
              {equipment.brand} • {equipment.categoryName}
            </Text>
            <Text className="text-3xl mb-4 tracking-tight text-white font-bold">{title}</Text>
            <View className="flex-row items-baseline gap-2 mb-4">
              <Text className="text-4xl text-[#FF8C42] font-semibold">₫{price.toLocaleString()}</Text>
              {!isProduct && <Text className="text-gray-400 text-sm">/ day</Text>}
            </View>
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center">
                <Star size={16} color="#FF8C42" fill="#FF8C42" />
                <Text className="text-sm text-gray-400 ml-1">4.9 (128 reviews)</Text>
              </View>
            </View>
          </View>

          {/* Asset Status Warning */}
          {!isProduct && status !== 'AVAILABLE' && (
             <View className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-4">
                 <Text className="text-red-500 font-bold">Currently Rented Out</Text>
                 <Text className="text-gray-400 text-xs mt-1">This item will be available soon.</Text>
             </View>
          )}

          {/* Description */}
          <View className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-5 mb-4">
            <Text className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-bold">Description</Text>
            <Text className="text-sm text-gray-300 leading-relaxed">{equipment.description}</Text>
          </View>

          {/* Guarantee */}
          <View className="bg-[#FF8C42]/10 border border-[#FF8C42]/20 rounded-3xl p-5 flex-row items-center gap-3">
            <Shield size={32} color="#FF8C42" />
            <View className="flex-1">
              <Text className="text-sm text-white mb-1 font-semibold">{isProduct ? 'Buyer Protection' : 'Verified Rental'}</Text>
              <Text className="text-xs text-gray-400">
                100% money-back guarantee if product doesn't match description
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-gray-800 px-6 pt-4 pb-8">
        {isProduct ? (
          // Product: Quantity selector + Buy Now
          <>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white font-semibold flex-1">Quantity</Text>
              <View className="flex-row items-center bg-[#1a1a1a] rounded-full border border-gray-800 w-32">
                <TouchableOpacity
                  className="w-10 h-10 items-center justify-center rounded-l-full"
                  onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  <Minus size={16} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-semibold flex-1 text-center min-w-[24px]">
                  {quantity}
                </Text>
                <TouchableOpacity
                  className="w-10 h-10 items-center justify-center rounded-r-full"
                  onPress={() => setQuantity(prev => prev + 1)}
                >
                  <Plus size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleAddToCart}
                className="flex-1 py-4 bg-gray-900 border border-gray-800 rounded-2xl items-center justify-center"
              >
                <Text className="text-white font-semibold">Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleBuyNow}
                className="flex-1 py-4 bg-[#FF8C42] rounded-2xl items-center justify-center"
              >
                <Text className="text-black font-bold">Buy Now</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // Asset: Date pickers + Rent Now
          <>
            {/* Date Pickers */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-xs text-gray-400 mb-2">Start Date</Text>
                <TouchableOpacity
                  onPress={() => setShowStartPicker(true)}
                  className="flex-row items-center bg-[#1a1a1a] border border-gray-800 rounded-2xl px-4 py-3"
                >
                  <Calendar size={16} color="#FF8C42" />
                  <Text className="text-white ml-2 flex-1">{formatDate(startDate)}</Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onStartDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>

              <View className="flex-1">
                <Text className="text-xs text-gray-400 mb-2">Return Date</Text>
                <TouchableOpacity
                  onPress={() => setShowEndPicker(true)}
                  className="flex-row items-center bg-[#1a1a1a] border border-gray-800 rounded-2xl px-4 py-3"
                >
                  <Calendar size={16} color="#FF8C42" />
                  <Text className="text-white ml-2 flex-1">{formatDate(endDate)}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onEndDateChange}
                    minimumDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)}
                  />
                )}
              </View>
            </View>

            {/* Rental Summary */}
            <View className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 mb-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-sm">Rental Period</Text>
                <Text className="text-white font-semibold">{calculateRentalDays()} day(s)</Text>
              </View>
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-gray-400 text-sm">Daily Rate</Text>
                <Text className="text-white">₫{price.toLocaleString()}</Text>
              </View>
              <View className="border-t border-gray-800 mt-3 pt-3 flex-row justify-between items-center">
                <Text className="text-white font-bold">Total</Text>
                <Text className="text-[#FF8C42] font-bold text-xl">₫{calculateRentalTotal().toLocaleString()}</Text>
              </View>
            </View>

            {/* Rent Button */}
            <TouchableOpacity
              onPress={handleRentNow}
              disabled={status !== 'AVAILABLE'}
              className={`w-full py-4 rounded-2xl items-center ${
                status !== 'AVAILABLE' ? 'bg-gray-600' : 'bg-[#FF8C42]'
              }`}
            >
              <Text className={`font-bold ${status !== 'AVAILABLE' ? 'text-gray-400' : 'text-black'}`}>
                {status !== 'AVAILABLE' ? 'Unavailable' : 'Rent Now'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
