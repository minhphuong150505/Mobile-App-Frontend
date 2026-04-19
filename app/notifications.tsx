import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ArrowLeft, Bell, Check, CheckCheck, Trash2, RefreshCw } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { notificationApi, Notification } from '@/services/api/notificationApi';

const LOAD_TIMEOUT_MS = 10000;

export default function NotificationsScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, isLoading: authLoading } = useAuth();
  const isInsideTab = pathname === '/(tabs)/notifications' || pathname.includes('(tabs)');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [systemNotifications, setSystemNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Track which token we last loaded with to avoid duplicate loads
  const lastLoadedTokenRef = useRef<string | null | undefined>(undefined);

  const doLoad = useCallback(async (authToken: string | null, pageNum: number = 0, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 0) {
        setIsLoading(true);
      }
      setError(null);

      // System notifications (public, fail-safe)
      let allSystem: Notification[] = [];
      try {
        allSystem = await notificationApi.getSystemNotifications();
      } catch {}
      setSystemNotifications(Array.isArray(allSystem) ? allSystem : []);

      // User notifications (authenticated)
      if (authToken) {
        const [notificationsData, countData] = await Promise.all([
          notificationApi.getNotifications(authToken, pageNum, 20),
          notificationApi.getUnreadCount(authToken),
        ]);
        const content = Array.isArray(notificationsData?.content) ? notificationsData.content : [];
        if (isRefresh || pageNum === 0) {
          setNotifications(content);
        } else {
          setNotifications(prev => [...(Array.isArray(prev) ? prev : []), ...content]);
        }
        setUnreadCount(typeof countData === 'number' ? countData : 0);
        setTotalPages(typeof notificationsData?.totalPages === 'number' ? notificationsData.totalPages : 0);
        setPage(typeof notificationsData?.page === 'number' ? notificationsData.page : 0);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err: any) {
      console.error('[Notifications] Load error:', err?.message);
      setError(err?.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // SINGLE effect: load on mount AND when token changes
  useEffect(() => {
    // Only load if this token hasn't been loaded yet
    if (lastLoadedTokenRef.current === token) return;

    // Wait for auth to finish before loading with token
    if (authLoading && token === null) {
      // Auth still loading, no token yet - load system notifications only
      console.log('[Notifications] Auth loading - loading system only');
      lastLoadedTokenRef.current = null;
      doLoad(null);
      return;
    }

    console.log('[Notifications] Loading with token:', token ? 'present' : 'null');
    lastLoadedTokenRef.current = token;
    doLoad(token);
  }, [token, authLoading, doLoad]);

  // Safety timeout
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      console.warn('[Notifications] TIMEOUT - forcing stop');
      setIsLoading(false);
      setRefreshing(false);
      setError(prev => prev || 'Loading timed out');
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!token) return;
    try {
      await notificationApi.markAsRead(token, notificationId);
      setNotifications(prev => prev.map(n =>
        n.notificationId === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;
    try {
      const count = await notificationApi.markAllAsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
      setUnreadCount(0);
      Alert.alert('Success', `Marked ${count} notifications as read`);
    } catch {}
  };

  const handleDelete = async (notificationId: string) => {
    if (!token) return;
    Alert.alert('Delete Notification', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await notificationApi.deleteNotification(token, notificationId);
          setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
        } catch { Alert.alert('Error', 'Failed to delete'); }
      }},
    ]);
  };

  const handleNavigateToNotification = (notification: Notification) => {
    if (!token) { router.push('/(auth)/login' as any); return; }
    if (!notification.isRead) handleMarkAsRead(notification.notificationId);
    if (notification.deepLinkUrl) {
      router.push(notification.deepLinkUrl.replace('mobile://', '/') as any);
    } else if (notification.referenceType === 'ORDER' && notification.referenceId) {
      router.push(`/orders/${notification.referenceId}` as any);
    } else if (notification.referenceType === 'RENTAL' && notification.referenceId) {
      router.push(`/rentals/detail/${notification.referenceId}` as any);
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ORDER_UPDATE': case 'SHIPPING_UPDATE': return '📦';
      case 'RENTAL_REMINDER': case 'RENTAL_OVERDUE': return '📅';
      case 'PAYMENT_SUCCESS': return '✅';
      case 'PAYMENT_FAILED': return '❌';
      case 'PROMOTION': return '🎉';
      default: return '🔔';
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    if (!item?.notificationId) return null;
    return (
      <TouchableOpacity onPress={() => handleNavigateToNotification(item)}
        className={`flex-row items-start px-4 py-3 border-b border-gray-800 ${!item.isRead ? 'bg-[#FF8C42]/5' : ''}`}>
        <View className="w-10 h-10 rounded-full bg-[#0a0a0a] items-center justify-center mr-3 flex-shrink-0">
          <Text className="text-xl">{getIcon(item.type)}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className={`text-sm flex-1 ${!item.isRead ? 'text-white font-semibold' : 'text-gray-400'}`} numberOfLines={1}>
              {item.title || 'Notification'}
            </Text>
            <Text className="text-xs text-gray-500 ml-2">
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
            </Text>
          </View>
          <Text className={`text-sm ${!item.isRead ? 'text-gray-200' : 'text-gray-500'}`} numberOfLines={2}>
            {item.message || ''}
          </Text>
          {item.isActionRequired && !item.isRead && (
            <Text className="text-xs text-[#FF8C42] font-medium mt-2">Action Required</Text>
          )}
        </View>
        {token && (
          <View className="flex-row items-center ml-2">
            {!item.isRead && (
              <TouchableOpacity onPress={() => handleMarkAsRead(item.notificationId)} className="p-2">
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
  };

  const allNotifications = [
    ...(Array.isArray(systemNotifications) ? systemNotifications.map(n => ({ ...n, _source: 'system' })) : []),
    ...(Array.isArray(notifications) ? notifications.map(n => ({ ...n, _source: 'user' })) : []),
  ];
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
        <TouchableOpacity onPress={() => { lastLoadedTokenRef.current = undefined; doLoad(token); }}
          className="mt-4 bg-[#FF8C42] px-6 py-3 rounded-xl flex-row items-center">
          <RefreshCw color="black" size={16} />
          <Text className="text-black font-bold ml-2">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      <View className="px-6 pt-16 pb-4 flex-row items-center border-b border-gray-800">
        {!isInsideTab && (
          <TouchableOpacity onPress={() => router.back()} className="mr-4 w-11 h-11 items-center justify-center">
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text className="text-xl text-white font-bold">Notifications</Text>
          {unreadCount > 0 && <Text className="text-sm text-[#FF8C42]">{unreadCount} unread</Text>}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead} className="p-2">
            <CheckCheck color="#FF8C42" size={24} />
          </TouchableOpacity>
        )}
      </View>

      {error && hasNotifications && (
        <View className="bg-red-900/30 px-4 py-2 flex-row items-center justify-between">
          <Text className="text-red-300 text-xs flex-1" numberOfLines={1}>{error}</Text>
          <TouchableOpacity onPress={() => { lastLoadedTokenRef.current = undefined; doLoad(token); }}>
            <RefreshCw color="#fca5a5" size={14} />
          </TouchableOpacity>
        </View>
      )}

      {!hasNotifications ? (
        <View className="flex-1 items-center justify-center px-6">
          <Bell color="#4b5563" size={64} />
          <Text className="text-gray-400 text-lg font-semibold mt-4">No Notifications</Text>
          <Text className="text-gray-500 text-sm mt-2 text-center">
            {token ? "When you receive notifications, they'll appear here" : 'Sign in to see your personal notifications'}
          </Text>
          {!token && (
            <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}
              className="mt-4 bg-[#FF8C42] px-6 py-3 rounded-xl">
              <Text className="text-black font-bold">Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={allNotifications}
          renderItem={renderItem}
          keyExtractor={item => `${item._source}-${item?.notificationId ?? Math.random().toString()}`}
          onRefresh={() => { lastLoadedTokenRef.current = undefined; doLoad(token, 0, true); }}
          refreshing={refreshing}
          onEndReached={() => { if (token && page < totalPages - 1) doLoad(token, page + 1); }}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
}