import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { ArrowLeft, Bell, Check, CheckCheck, Trash2 } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { notificationApi, Notification } from '@/services/api/notificationApi';

/**
 * Notifications Screen - API-connected, user-specific notifications
 *
 * AUTH GUARD: Redirects to login if user is not authenticated
 */
export default function NotificationsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { token, user, isLoading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(!authLoading);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // AUTH GUARD: Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !token && !user) {
      // Silently redirect without alert for better UX
      router.replace('/(auth)/login' as any);
      return;
    }

    // Only load notifications if we have token and not loading
    if (token && !authLoading) {
      loadNotifications();
    }
  }, [token, authLoading]);

  const loadNotifications = async (pageNum: number = 0, refresh: boolean = false) => {
    if (!token) return;

    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNum === 0) {
        setIsLoading(true);
      }

      const [notificationsData, countData] = await Promise.all([
        notificationApi.getNotifications(token, pageNum, 20),
        notificationApi.getUnreadCount(token),
      ]);

      if (refresh || pageNum === 0) {
        setNotifications(notificationsData.content);
      } else {
        setNotifications(prev => [...prev, ...notificationsData.content]);
      }

      setUnreadCount(countData);
      setTotalPages(notificationsData.totalPages);
      setPage(notificationsData.page);
    } catch (error: any) {
      console.error('Failed to load notifications:', error);
      if (error.message?.includes('Unauthorized')) {
        router.replace('/(auth)/login' as any);
        return;
      }
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!token) return;

    try {
      await notificationApi.markAsRead(token, notificationId);

      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.notificationId === notificationId
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;

    try {
      const count = await notificationApi.markAllAsRead(token);

      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);

      Alert.alert('Success', `Marked ${count} notifications as read`);
    } catch (error: any) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!token) return;

    Alert.alert('Delete Notification', 'Are you sure you want to delete this notification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await notificationApi.deleteNotification(token, notificationId);
            setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
          } catch (error: any) {
            console.error('Failed to delete:', error);
            Alert.alert('Error', 'Failed to delete notification');
          }
        },
      },
    ]);
  };

  const handleNavigateToNotification = (notification: Notification) => {
    // Mark as read when tapped
    if (!notification.isRead) {
      handleMarkAsRead(notification.notificationId);
    }

    // Navigate based on deep link or reference type
    if (notification.deepLinkUrl) {
      // Extract path from deep link (e.g., mobile://order-details?id=xxx)
      const url = notification.deepLinkUrl.replace('mobile://', '/');
      router.push(url as any);
    } else if (notification.referenceType === 'ORDER' && notification.referenceId) {
      router.push(`/(tabs)/orders` as any);
    } else if (notification.referenceType === 'RENTAL' && notification.referenceId) {
      router.push(`/(tabs)/rentals` as any);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ORDER_UPDATE':
      case 'SHIPPING_UPDATE':
        return '📦';
      case 'RENTAL_REMINDER':
      case 'RENTAL_OVERDUE':
        return '📅';
      case 'PAYMENT_SUCCESS':
        return '✅';
      case 'PAYMENT_FAILED':
        return '❌';
      case 'PROMOTION':
        return '🎉';
      case 'SYSTEM':
      default:
        return '';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => handleNavigateToNotification(item)}
      className={`flex-row items-start px-4 py-3 border-b border-gray-800 ${
        !item.isRead ? 'bg-[#FF8C42]/5' : ''
      }`}
    >
      {/* Icon */}
      <View className="w-10 h-10 rounded-full bg-[#0a0a0a] items-center justify-center mr-3 flex-shrink-0">
        <Text className="text-xl">{getNotificationIcon(item.type)}</Text>
      </View>

      {/* Content */}
      <View className="flex-1 flex-shrink-0">
        <View className="flex-row items-center justify-between mb-1">
          <Text
            className={`text-sm flex-1 ${
              !item.isRead ? 'text-white font-semibold' : 'text-gray-400'
            }`}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text className="text-xs text-gray-500 ml-2">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Text
          className={`text-sm ${!item.isRead ? 'text-gray-200' : 'text-gray-500'}`}
          numberOfLines={2}
        >
          {item.message}
        </Text>

        {item.isActionRequired && !item.isRead && (
          <View className="mt-2">
            <Text className="text-xs text-[#FF8C42] font-medium">Action Required</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View className="flex-row items-center ml-2">
        {!item.isRead && (
          <TouchableOpacity
            onPress={() => handleMarkAsRead(item.notificationId)}
            className="p-2"
          >
            <Check color="#9ca3af" size={18} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => handleDelete(item.notificationId)} className="p-2">
          <Trash2 color="#6b7280" size={18} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#1a1a1a] items-center justify-center">
        <ActivityIndicator size="large" color="#FF8C42" />
        <Text className="text-gray-400 mt-4">Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      {/* Header */}
      <View className="px-6 pt-16 pb-4 flex-row items-center border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl text-white font-bold">Notifications</Text>
          {unreadCount > 0 && (
            <Text className="text-sm text-[#FF8C42]">{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead} className="p-2">
            <CheckCheck color="#FF8C42" size={24} />
          </TouchableOpacity>
        )}
      </View>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Bell color="#4b5563" size={64} />
          <Text className="text-gray-400 text-lg font-semibold mt-4">No Notifications</Text>
          <Text className="text-gray-500 text-sm mt-2 text-center">
            When you receive notifications, they'll appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.notificationId}
          onRefresh={() => loadNotifications(0, true)}
          refreshing={refreshing}
          onEndReached={() => {
            if (page < totalPages - 1) {
              loadNotifications(page + 1);
            }
          }}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
}
