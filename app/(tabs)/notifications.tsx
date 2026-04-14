import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

/**
 * Notifications Tab - Redirects to the API-connected notifications screen
 *
 * This screen acts as a redirect placeholder for the tab navigator.
 * The actual notifications UI is in app/notifications.tsx which fetches
 * real user-specific notifications from the backend.
 */
export default function NotificationsTabRedirect() {
  const router = useRouter();
  const navigation = useNavigation();
  const { token, user } = useAuth();

  useEffect(() => {
    // Redirect to the API-connected notifications screen
    // Using replace to prevent back button showing the redirect screen
    const redirect = setTimeout(() => {
      router.replace('/notifications' as any);
    }, 100);

    return () => clearTimeout(redirect);
  }, []);

  // Show loading indicator during redirect
  return (
    <View className="flex-1 bg-[#1a1a1a] items-center justify-center">
      <ActivityIndicator size="large" color="#FF8C42" />
    </View>
  );
}
