// API Base URL Configuration
// - iOS Simulator: http://localhost:8080/api works
// - Android Emulator: Needs http://10.0.2.2:8080/api (Android's localhost alias)
// - Physical Device: Needs your computer's IP (e.g., http://192.168.1.100:8080/api)
//
// To configure for your device:
// 1. Find your computer's IP:
//    - Windows: ipconfig (look for IPv4 Address)
//    - Mac/Linux: ifconfig (look for inet under en0/wlan0)
// 2. Update .env file: EXPO_PUBLIC_API_URL=http://YOUR_IP:8080/api
// 3. Restart Expo: npx expo start -c (clear cache)

// Note: In Expo SDK 54, process.env may not work directly.
// The .env file is read at build time. Restart Expo dev server after changes.
const DEFAULT_URL = 'http://localhost:8080/api';

// Try multiple ways to get the environment variable
const getEnvUrl = (): string | undefined => {
  // @ts-ignore - Expo may inject this at runtime
  if (typeof __DEV__ !== 'undefined' && process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  return undefined;
};

export const BASE_URL = getEnvUrl() || DEFAULT_URL;

// Debug log - remove in production
if (__DEV__) {
  console.log('[API Config] BASE_URL:', BASE_URL);
  console.log('[API Config] process.env.EXPO_PUBLIC_API_URL:', process.env.EXPO_PUBLIC_API_URL);
}

// Helper to detect if we might have connection issues
const detectConnectionIssue = (): string | null => {
  if (BASE_URL.includes('localhost')) {
    return 'Using localhost - this works on iOS Simulator but NOT on Android Emulator or physical devices. See config.ts for solutions.';
  }
  return null;
};

// Log potential connection issues on module load
const connectionWarning = detectConnectionIssue();
if (connectionWarning && __DEV__) {
  console.warn('⚠️  API Config:', connectionWarning);
}

export const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const handleResponse = async (response: Response) => {
  let text: string;
  try {
    text = await response.text();
  } catch (e) {
    throw new Error('Cannot connect to server - please check if backend is running on port 8080');
  }

  if (!text) {
    throw new Error('Server returned empty response');
  }

  let data: any;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Server returned invalid response');
  }

  if (!response.ok) {
    // Handle specific HTTP status codes with user-friendly messages
    if (response.status === 401) {
      throw new Error('Unauthorized - please login again');
    }
    if (response.status === 403) {
      throw new Error('Access denied - insufficient permissions');
    }
    if (response.status === 404) {
      throw new Error('Resource not found');
    }
    if (response.status === 500) {
      throw new Error('Server error - please try again later');
    }
    throw new Error(data.message || data.error || `Request failed (${response.status})`);
  }

  return data;
};

// Network error types for better error handling
export const NetworkError = {
  CONNECTION_FAILED: 'Cannot connect to server - please check if backend is running',
  INVALID_RESPONSE: 'Server returned invalid response',
  UNAUTHORIZED: 'Session expired - please login again',
  TIMEOUT: 'Request timed out - please check your connection',
};
