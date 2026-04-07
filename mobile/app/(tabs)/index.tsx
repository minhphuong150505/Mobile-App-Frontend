import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Search, Heart, ShoppingCart } from 'lucide-react-native';
import { Link } from 'expo-router';

export default function DiscoveryScreen() {
  const featuredProducts = [
    {
      id: 1,
      title: "LEICA M11",
      category: "Premium Camera",
      price: "199.000.000",
      image: "https://images.unsplash.com/photo-1725779318629-eda3e096eb86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FtZXJhJTIwYWVzdGhldGljJTIwZGFya3xlbnwxfHx8fDE3NzUwMTUzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: "NEW",
    },
    {
      id: 2,
      title: "HASSELBLAD X2D",
      category: "Medium Format",
      price: "175.000.000",
      image: "https://images.unsplash.com/photo-1511140973288-19bf21d7e771?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2FtZXJhJTIwZ2VhciUyMGx1eHVyeXxlbnwxfHx8fDE3NzUwMTUzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: "HOT",
    },
    {
      id: 3,
      title: "SONY α1",
      category: "Mirrorless",
      price: "145.000.000",
      image: "https://images.unsplash.com/photo-1585548601784-e319505354bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2FtZXJhJTIwZ2VhciUyMGx1eHVyeXxlbnwxfHx8fDE3NzUwMTUzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const categories = [
    { name: "Cameras", count: 124 },
    { name: "Lenses", count: 286 },
    { name: "Lighting", count: 97 },
    { name: "Accessories", count: 342 },
  ];

  return (
    <ScrollView className="flex-1 bg-[#1a1a1a]">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-3xl mb-1 text-white font-bold tracking-tight">DISCOVERY</Text>
            <Text className="text-sm text-gray-400">Explore premium equipment</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-gray-800">
            <ShoppingCart size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="relative">
          <View className="absolute left-4 top-4 z-10">
            <Search size={16} color="#6b7280" />
          </View>
          <TextInput
            placeholder="Search equipment..."
            placeholderTextColor="#4b5563"
            className="pl-11 pr-4 py-4 bg-[#0a0a0a] border border-gray-800 rounded-2xl text-white"
          />
        </View>
      </View>

      {/* Categories */}
      <View className="px-6 mb-8">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3 overflow-visible pb-2">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              className="px-5 py-3 mr-3 bg-[#0a0a0a] border border-gray-800 rounded-full flex-row transition-colors"
            >
              <Text className="text-sm text-white">{category.name}</Text>
              <Text className="text-xs text-gray-500 ml-2">({category.count})</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Banner */}
      <View className="px-6 mb-8">
        <View className="bg-[#FF8C42] rounded-3xl p-8 relative overflow-hidden">
          <View className="relative z-10">
            <Text className="text-xs tracking-widest mb-2 opacity-90 font-bold text-black">SPECIAL OFFER</Text>
            <Text className="text-2xl mb-2 tracking-tight text-white font-bold">Summer Sale</Text>
            <Text className="text-sm opacity-90 mb-4 text-white">Up to 30% off on selected items</Text>
            <TouchableOpacity className="bg-black px-6 py-3 rounded-full self-start">
              <Text className="text-white text-sm font-semibold">Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Featured Section */}
      <View className="px-6 pb-8">
        <View className="flex-row items-baseline justify-between mb-6">
          <Text className="text-xl tracking-tight text-white font-bold">Featured</Text>
          <TouchableOpacity>
            <Text className="text-sm text-[#FF8C42]">See all</Text>
          </TouchableOpacity>
        </View>

        <View className="space-y-4">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/equipment/${product.id}`} asChild>
              <TouchableOpacity className="block bg-[#0a0a0a] rounded-3xl overflow-hidden border border-gray-800 mb-4 transition-all">
                <View className="relative aspect-[4/3] w-full bg-gray-900">
                  <Image
                    source={{ uri: product.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  {product.badge && (
                    <View className="absolute top-4 right-4 bg-[#FF8C42] px-3 py-1 rounded-full">
                      <Text className="text-black text-xs font-medium">{product.badge}</Text>
                    </View>
                  )}
                  <TouchableOpacity className="absolute top-4 left-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center border border-white/20">
                    <Heart size={16} color="white" />
                  </TouchableOpacity>
                </View>
                <View className="p-5">
                  <Text className="text-xs text-gray-500 mb-1 tracking-wide uppercase">
                    {product.category}
                  </Text>
                  <Text className="text-xl mb-3 tracking-tight text-white font-bold">{product.title}</Text>
                  <View className="flex-row items-baseline gap-1">
                    <Text className="text-2xl text-[#FF8C42] font-semibold">₫{product.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>

      {/* Rental Section */}
      <View className="px-6 pb-8">
        <View className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-lg mb-1 tracking-tight text-white font-bold">Rental Service</Text>
              <Text className="text-xs text-gray-400">Try before you buy</Text>
            </View>
            <Text className="text-3xl">📷</Text>
          </View>
          <Text className="text-sm text-gray-400 mb-4">
            Rent professional equipment starting from ₫500,000/day
          </Text>
          <TouchableOpacity className="w-full py-4 bg-white rounded-full items-center justify-center">
            <Text className="text-black text-sm font-semibold">Browse Rentals</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
