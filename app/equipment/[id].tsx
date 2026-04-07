import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ArrowLeft, Heart, Share2, Star, Shield, CheckCircle } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function EquipmentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const equipment = {
    id: Number(id) || 1,
    title: "LEICA M11",
    category: "Premium Camera",
    price: "199.000.000",
    rating: 4.9,
    reviews: 128,
    sold: 23,
    image: "https://images.unsplash.com/photo-1725779318629-eda3e096eb86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FtZXJhJTIwYWVzdGhldGljJTIwZGFya3xlbnwxfHx8fDE3NzUwMTUzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    condition: "Brand New",
    seller: {
      name: "Premium Camera Store",
      rating: 4.9,
      verified: true,
    },
    description:
      "The Leica M11 is a state-of-the-art digital rangefinder camera featuring a 60MP full-frame sensor, exceptional build quality, and legendary Leica optics. This camera represents the pinnacle of precision engineering and photographic excellence.",
    specs: [
      { label: "Sensor", value: "60MP Full-Frame BSI-CMOS" },
      { label: "ISO Range", value: "64-50000" },
      { label: "Video", value: "5K 30fps" },
      { label: "Storage", value: "256GB Internal + SD" },
    ],
    includes: [
      "Leica M11 Camera Body",
      "Rechargeable Battery",
      "Battery Charger",
      "USB-C Cable",
      "Camera Strap",
      "Original Box & Documentation",
    ],
  };

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Header */}
        <View className="relative">
          <View className="aspect-square bg-black w-full">
            <Image
              source={{ uri: equipment.image }}
              className="w-full h-full"
              resizeMode="cover"
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
              <TouchableOpacity className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center border border-white/10">
                <Share2 size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center border border-white/10">
                <Heart size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Condition Badge */}
          <View className="absolute bottom-4 left-4">
            <View className="bg-[#FF8C42] px-3 py-1.5 rounded-full">
              <Text className="text-black text-xs font-medium">{equipment.condition}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 py-6 space-y-4">
          {/* Title & Price */}
          <View className="mb-4">
            <Text className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">
              {equipment.category}
            </Text>
            <Text className="text-3xl mb-4 tracking-tight text-white font-bold">{equipment.title}</Text>
            <View className="flex-row items-baseline gap-2 mb-4">
              <Text className="text-4xl text-[#FF8C42] font-semibold">₫{equipment.price}</Text>
            </View>
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center">
                <Star size={16} color="#FF8C42" fill="#FF8C42" className="mr-1" />
                <Text className="text-sm text-gray-400 ml-1">
                  {equipment.rating} ({equipment.reviews})
                </Text>
              </View>
              <Text className="text-sm text-gray-400">Sold: {equipment.sold}</Text>
            </View>
          </View>

          {/* Seller Info */}
          <View className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-5 mb-4">
            <Text className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Seller</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-full bg-[#FF8C42] flex items-center justify-center">
                  <Text className="text-black font-semibold text-lg">{equipment.seller.name.charAt(0)}</Text>
                </View>
                <View>
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-sm text-white font-medium">{equipment.seller.name}</Text>
                    {equipment.seller.verified && (
                      <CheckCircle size={16} color="#FF8C42" />
                    )}
                  </View>
                  <View className="flex-row items-center">
                    <Star size={12} color="#FF8C42" fill="#FF8C42" />
                    <Text className="text-xs text-gray-500 ml-1">{equipment.seller.rating}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl">
                <Text className="text-white text-sm font-medium">Visit Store</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-5 mb-4">
            <Text className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Description</Text>
            <Text className="text-sm text-gray-400 leading-relaxed">{equipment.description}</Text>
          </View>

          {/* Specifications */}
          <View className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-5 mb-4">
            <Text className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Specifications</Text>
            <View className="space-y-3">
              {equipment.specs.map((spec, index) => (
                <View
                  key={index}
                  className={`flex-row justify-between py-2 ${
                    index !== equipment.specs.length - 1 ? "border-b border-gray-800" : ""
                  }`}
                >
                  <Text className="text-sm text-gray-500">{spec.label}</Text>
                  <Text className="text-sm text-gray-300">{spec.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Includes */}
          <View className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-5 mb-4">
            <Text className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">What's Included</Text>
            <View className="space-y-2">
              {equipment.includes.map((item, index) => (
                <View key={index} className="flex-row items-start gap-2 mb-2">
                  <CheckCircle size={16} color="#FF8C42" className="mt-0.5" />
                  <Text className="text-sm text-gray-400 flex-1 ml-2">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Guarantee */}
          <View className="bg-[#FF8C42]/10 border border-[#FF8C42]/20 rounded-3xl p-5 flex-row items-center gap-3">
            <Shield size={32} color="#FF8C42" />
            <View className="flex-1">
              <Text className="text-sm text-white mb-1 font-semibold">Buyer Protection</Text>
              <Text className="text-xs text-gray-400">
                100% money-back guarantee if product doesn't match description
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-gray-800 px-6 pt-4 pb-8 flex-row gap-3">
        <TouchableOpacity className="flex-1 py-4 bg-gray-900 border border-gray-800 rounded-2xl items-center justify-center">
          <Text className="text-white font-semibold">Contact Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 py-4 bg-[#FF8C42] rounded-2xl items-center justify-center">
          <Text className="text-black font-semibold">Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
