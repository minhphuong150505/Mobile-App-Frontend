import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Check, CheckCheck, Trash2, RefreshCw } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { notificationApi, Notification } from '@/services/api/notificationApi';

export default function NotificationsScreen() {
  const router = useRouter();
  const { token, user, isLoading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [systemNotifications, setSystemNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async (pageNum: number = 0, refresh: boolean = false) => {
    try {
      setError(null);
      if (refresh) {
        setRefreshing(true);
      } else if (pageNum === 0) {
        setIsLoading(true);
      }

      // Always load system notifications (public)
      const systemPromise = notificationApi.getSystemNotifications().catch(() => []);

      // Load user notifications only if authenticated
      const allSystem = await systemPromise;
      setSystemNotifications(allSystem);

      if (token) {
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
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err: any) {
      console.error('[Notifications] Failed to load:', err);
      setError(err.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  React.useEffect(() => {
    if (!authLoading) {
      loadNotifications();
    }
  }, [authLoading, loadNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!token) return;
    try {
      await notificationApi.markAsRead(token, notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.notificationId === notificationId
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;
    try {
      const count = await notificationApi.markAllAsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
      setUnreadCount(0);
      Alert.alert('Success', `Marked ${count} notifications as read`);
    } catch (err: any) {
      console.error('Failed to mark all as read:', err);
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
          } catch (err: any) {
            Alert.alert('Error', 'Failed to delete notification');
          }
        },
      },
    ]);
  };

  const handleNavigateToNotification = (notification: Notification) => {
    if (!token) {
      router.push('/(auth)/login' as any);
      return;
    }
    if (!notification.isRead) {
      handleMarkAsRead(notification.notificationId);
    }
    if (notification.deepLinkUrl) {
      const url = notification.deepLinkUrl.replace('mobile://', '/');
      router.push(url as any);
    } else if (notification.referenceType === 'ORDER' && notification.referenceId) {
      router.push(`/orders/${notification.referenceId}` as any);
    } else if (notification.referenceType === 'RENTAL' && notification.referenceId) {
      router.push(`/rentals/detail/${notification.referenceId}` as any);
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
        return '🔔';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => handleNavigateToNotification(item)}
      className={`flex-row items-start px-4 py-3 border-b border-gray-800 ${
        !item.isRead ? 'bg-[#FF8C42]/5' : ''
      }`}
    >
      <View className="w-10 h-10 rounded-full bg-[#0a0a0a] items-center justify-center mr-3 flex-shrink-0">
        <Text className="text-xl">{getNotificationIcon(item.type)}</Text>
      </View>

      <View className="flex-1">
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

      {token && (
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
      )}
    </TouchableOpacity>
  );

  // Combine system notifications (public) with user notifications (authenticated)
  const allNotifications = [...systemNotifications, ...notifications];
  const hasNotifications = allNotifications.length > 0;

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#1a1a1a] items-center justify-center">
        <ActivityIndicator size="large" color="#FF8C42" />
        <Text className="text-gray-400 mt-4">Loading notifications...</Text>
      </View>
    );
  }

  if (error && !hasNotifications) {
    return (
      <View className="flex-1 bg-[#1a1a1a] items-center justify-center px-6">
        <Bell color="#4b5563" size={64} />
        <Text className="text-gray-400 text-lg font-semibold mt-4">Could not load notifications</Text>
        <Text className="text-gray-500 text-sm mt-2 text-center">{error}</Text>
        <TouchableOpacity
          onPress={() => loadNotifications()}
          className="mt-4 bg-[#FF8C42] px-6 py-3 rounded-xl flex-row items-center"
        >
          <RefreshCw color="black" size={16} />
          <Text className="text-black font-bold ml-2">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      {/* Header */}
      <View className="px-6 pt-16 pb-4 flex-row items-center border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 w-11 h-11 items-center justify-center">
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
      {!hasNotifications ? (
        <View className="flex-1 items-center justify-center px-6">
          <Bell color="#4b5563" size={64} />
          <Text className="text-gray-400 text-lg font-semibold mt-4">No Notifications</Text>
          <Text className="text-gray-500 text-sm mt-2 text-center">
            {token
              ? 'When you receive notifications, they\'ll appear here'
              : 'Sign in to see your personal notifications'}
          </Text>
          {!token && (
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login' as any)}
              className="mt-4 bg-[#FF8C42] px-6 py-3 rounded-xl"
            >
              <Text className="text-black font-bold">Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={allNotifications}
          renderItem={renderNotification}
          keyExtractor={item => item.notificationId}
          onRefresh={() => loadNotifications(0, true)}
          refreshing={refreshing}
          onEndReached={() => {
            if (token && page < totalPages - 1) {
              loadNotifications(page + 1);
            }
          }}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
}