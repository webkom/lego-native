import AsyncStorage from '@react-native-async-storage/async-storage';
import env from 'env';
import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import { checkSessionToken, updateSessionToken } from '../hooks/useAuth';
import type { paths } from '../types/schema';

const fetchClient = createFetchClient<paths>({
  baseUrl: env.EXPO_PUBLIC_API_URL,
});

fetchClient.use({
  async onRequest({ request }) {
    const valid = await checkSessionToken();
    if (!valid) {
      await updateSessionToken(true);
    }

    const token = await AsyncStorage.getItem('session-token');
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },
});

export const api = createClient(fetchClient);
export { fetchClient };
