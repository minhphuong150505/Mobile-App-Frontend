import { BASE_URL, getHeaders, handleResponse } from './config';

export interface Notification {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: 'ORDER_UPDATE' | 'RENTAL_REMINDER' | 'RENTAL_OVERDUE' | 'SYSTEM' | 'PROMOTION' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'SHIPPING_UPDATE';
  referenceId?: string;
  referenceType?: 'ORDER' | 'RENTAL';
  isRead: boolean;
  isActionRequired: boolean;
  actionUrl?: string;
  deepLinkUrl?: string;
  createdAt: string;
  readAt?: string;
}

export interface NotificationsResponse {
  content: Notification[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

export const notificationApi = {
  /**
   * Get all notifications for current user (paginated)
   */
  getNotifications: async (token: string, page: number = 0, size: number = 20): Promise<NotificationsResponse> => {
    const response = await fetch(`${BASE_URL}/notifications?page=${page}&size=${size}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    const data = await handleResponse(response);
    return data.data as NotificationsResponse;
  },

  /**
   * Get unread notifications
   */
  getUnreadNotifications: async (token: string): Promise<Notification[]> => {
    const response = await fetch(`${BASE_URL}/notifications/unread`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    const data = await handleResponse(response);
    return data.data as Notification[];
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (token: string): Promise<number> => {
    const response = await fetch(`${BASE_URL}/notifications/unread/count`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    const data = await handleResponse(response);
    return (data.data as UnreadCountResponse).count;
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (token: string, notificationId: string): Promise<Notification> => {
    const response = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    const data = await handleResponse(response);
    return data.data as Notification;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (token: string): Promise<number> => {
    const response = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    const data = await handleResponse(response);
    return (data.data as { markedCount: number }).markedCount;
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (token: string, notificationId: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    await handleResponse(response);
  },

  /**
   * Create a test notification (for development)
   */
  createTestNotification: async (
    token: string,
    type: string,
    title: string,
    message: string
  ): Promise<Notification> => {
    const response = await fetch(`${BASE_URL}/notifications/test`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ type, title, message }),
    });
    const data = await handleResponse(response);
    return data.data as Notification;
  },

  /**
   * Get system/broadcast notifications (public, no auth required)
   */
  getSystemNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await fetch(`${BASE_URL}/notifications/system`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await handleResponse(response);
      return (data.data as Notification[]) || [];
    } catch {
      // System notifications are best-effort, don't throw
      return [];
    }
  },
};
