import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

// Get API base URL from environment or use default
// For OAuth to work, this must be accessible from the device/browser
const getApiBaseUrl = () => {
  const envUrl = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.replace('/api', ''); // Remove /api suffix for OAuth URLs
  }
  // Default for development
  return 'http://localhost:8080';
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);

    if (success) {
      router.replace('/(tabs)');
    } else {
      // Show specific error messages
      let errorMessage = error || 'Invalid email or password';
      if (error?.includes('localhost')) {
        errorMessage = 'Cannot connect to server.\n\nIf using Android Emulator, use http://10.0.2.2:8080/api\nIf using physical device, use your computer\'s IP address.';
      } else if (error?.includes('Unauthorized')) {
        errorMessage = 'Invalid email or password';
      } else if (error?.includes('Cannot connect')) {
        errorMessage = 'Cannot connect to server.\n\nPlease check:\n1. Backend is running on port 8080\n2. API URL is correct in .env file';
      }
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <View className="flex-1 bg-[#1a1a1a] p-6 pt-16">
      <TouchableOpacity onPress={() => router.back()} className="mb-8">
        <ArrowLeft color="white" size={24} />
      </TouchableOpacity>

      <Text className="text-3xl text-white font-bold mb-2">Welcome Back</Text>
      <Text className="text-sm text-gray-400 mb-8">Sign in to continue to Camera Shop</Text>

      <View className="space-y-4">
        <TextInput
          placeholder="Email"
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#6b7280"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="bg-[#0a0a0a] text-white p-4 rounded-xl border border-gray-800 mb-6"
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isSubmitting || isLoading}
          className="bg-[#FF8C42] py-4 rounded-xl items-center disabled:opacity-50"
        >
          {isSubmitting || isLoading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text className="text-black font-bold text-base">Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-400">Don't have an account? </Text>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity>
            <Text className="text-[#FF8C42] font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Divider */}
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-[1px] bg-gray-800" />
        <Text className="text-gray-500 px-4 text-sm">OR CONTINUE WITH</Text>
        <View className="flex-1 h-[1px] bg-gray-800" />
      </View>

      {/* OAuth Buttons */}
      <View className="space-y-3">
        <TouchableOpacity
          onPress={() => {
            // Open OAuth login in web browser
            // Backend will redirect to frontend oauth-success route with token
            // Use environment-aware base URL
            const baseUrl = getApiBaseUrl();
            const authUrl = `${baseUrl}/oauth2/authorization/google`;
            console.log('Opening OAuth URL:', authUrl);
            WebBrowser.openBrowserAsync(authUrl, {
              dismissButtonStyle: 'cancel',
              preferredBarTintColor: '#1a1a1a',
              preferredControlTintColor: 'white',
            });
          }}
          className="w-full bg-white py-4 rounded-xl items-center flex-row justify-center px-4"
        >
          <Text className="text-black font-bold text-base">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // Apple login would be implemented similarly
            Alert.alert('Coming Soon', 'Apple login will be available soon');
          }}
          className="w-full bg-[#0a0a0a] border border-gray-800 py-4 rounded-xl items-center flex-row justify-center px-4"
        >
          <Text className="text-white font-bold text-base">Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      {/* Test credentials hint */}
      <View className="mt-8 p-4 bg-[#0a0a0a] rounded-xl border border-gray-800">
        <Text className="text-xs text-gray-500 mb-2 font-semibold">TEST CREDENTIALS:</Text>
        <Text className="text-xs text-gray-400">Email: test@example.com</Text>
        <Text className="text-xs text-gray-400">Password: password123</Text>
        <Text className="text-xs text-gray-500 mt-2">OR (Admin):</Text>
        <Text className="text-xs text-gray-400">Email: john@example.com</Text>
        <Text className="text-xs text-gray-400">Password: password123</Text>
      </View>
    </View>
  );
}
