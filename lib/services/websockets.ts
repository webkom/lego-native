import AsyncStorage from '@react-native-async-storage/async-storage';
import env from 'env';
import { SocketEvent } from '../types/websockets';

export const getWebSocketUrl = (token: string | null) => {
  const baseUrl = env.EXPO_PUBLIC_API_URL;
  // Convert http:// or https:// to ws:// or wss://
  let wsUrl = baseUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');

  // Strip trailing slash or /api/v1 path if present
  wsUrl = wsUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

  // For local development, backend Django Channels WS runs on port 8001
  if (wsUrl.includes('localhost:8000') || wsUrl.includes('127.0.0.1:8000')) {
    // wsUrl = wsUrl.replace(':8000', ':8001');
  }

  const query = token ? `?jwt=${encodeURIComponent(token)}` : '';
  return `${wsUrl}/${query}`;
};

export const setupWebSocketServer = async (
  messageCallback: (message: SocketEvent) => void
): Promise<WebSocket | null> => {
  const token = await AsyncStorage.getItem('session-token');
  if (!token) {
    console.log('[WebSocket] No session token found, skipping connection');
    return null;
  }

  const socketUrl = getWebSocketUrl(token);
  console.log('[WebSocket] Connecting to:', socketUrl);

  try {
    const ws = new WebSocket(socketUrl);

    ws.onopen = () => {
      console.log('[WebSocket] Connection established successfully');
    };

    ws.onerror = (error) => {
      // console.log('[WebSocket] Connection error:', error);
      console.log('[WebSocket] Connection error');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as SocketEvent;
        messageCallback(message);
      } catch (err) {
        console.log('[WebSocket] Failed to parse message data:', err);
      }
    };

    return ws;
  } catch (err) {
    console.log('[WebSocket] Failed to initialize WebSocket:', err);
    return null;
  }
};
