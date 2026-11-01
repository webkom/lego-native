import env from '@/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  refreshAsync,
  useAuthRequest,
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { getDefaultStore, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { userAtom } from '../atoms/user-atom';
import { me } from '../services/auth';
import { RESET } from 'jotai/utils';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri({
  scheme: 'abakus',
  path: 'non-authed/sign-in',
});

const config = {
  clientId: env.EXPO_PUBLIC_AUTH_CLIENT_ID,
  redirectUri,
};

const discovery = {
  authorizationEndpoint: `${env.EXPO_PUBLIC_API_URL}/authorization/oauth2/authorize/`,
  // LEGO complains about missing trailing slash in token endpoint (because exchangeCodeAsync strips it),
  // so I applied this fix: https://github.com/expo/expo/issues/34385
  tokenEndpoint: `${env.EXPO_PUBLIC_API_URL}/authorization/oauth2/token/#`,
  userInfoEndpoint: `${env.EXPO_PUBLIC_API_URL}/api/v1/users/me/`,
};

export const AuthConfig = {
  config,
  discovery,
};

export const signOut = async () => {
  const store = getDefaultStore();
  await store.set(userAtom, RESET);
  await AsyncStorage.multiRemove(['session-token', 'refresh-token', 'expires-at']);
};

export const updateSessionToken = async (skipTokenCheck?: boolean) => {
  if (!skipTokenCheck) {
    const valid = await checkSessionToken();
    if (valid) return;
  }

  const refreshToken = await AsyncStorage.getItem('refresh-token');
  if (!refreshToken) {
    // Sign out the user, we cannot update the session
    signOut();
    return;
  }

  const result = await refreshAsync(
    { ...AuthConfig.config, refreshToken: refreshToken },
    AuthConfig.discovery
  );

  if (result.accessToken) {
    await AsyncStorage.setItem('session-token', result.accessToken);
  }

  if (result.refreshToken) {
    await AsyncStorage.setItem('refresh-token', result.refreshToken);
  }

  if (result.expiresIn) {
    // Subtract 30 seconds from the expiration time to account for potential clock issues
    const newExpiresAt = new Date().getTime() + (result.expiresIn - 30) * 1000;
    await AsyncStorage.setItem('expires-at', newExpiresAt.toString());
  }
};

export const checkSessionToken = async () => {
  const expiresAt = await AsyncStorage.getItem('expires-at');
  if (expiresAt && new Date().getTime() > parseInt(expiresAt, 10)) {
    return false;
  }
  return true;
};

export const useAuth = () => {
  const setUser = useSetAtom(userAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setIsError] = useState<Error | null>(null);
  const [authRequest, authResult, authenticate] = useAuthRequest(config, discovery);

  useEffect(() => {
    if (!authResult || authResult.type !== 'success') return;

    const exchangeToken = async () => {
      try {
        setIsLoading(true);
        setIsError(null);

        if (!authResult.params.code) {
          throw new Error('No code returned from authentication');
        }

        const tokenResponse = await exchangeCodeAsync(
          {
            clientId: env.EXPO_PUBLIC_AUTH_CLIENT_ID,
            code: authResult.params.code,
            redirectUri,
            extraParams: authRequest?.codeVerifier
              ? { code_verifier: authRequest.codeVerifier }
              : undefined,
          },
          {
            ...discovery,

            tokenEndpoint: discovery.tokenEndpoint,
          }
        );

        await AsyncStorage.setItem('session-token', tokenResponse.accessToken);
        if (tokenResponse.refreshToken) {
          await AsyncStorage.setItem('refresh-token', tokenResponse.refreshToken);
        }

        if (tokenResponse.expiresIn) {
          // Subtract 30 seconds from the expiration time to account for potential clock issues
          const expiresAt = new Date().getTime() + (tokenResponse.expiresIn - 30) * 1000;
          await AsyncStorage.setItem('expires-at', expiresAt.toString());
        }

        const currentUser = await me();
        setUser(currentUser);
      } catch (error) {
        setIsError(error instanceof Error ? error : new Error('Token exchange failed'));
      } finally {
        setIsLoading(false);
      }
    };

    void exchangeToken();
  }, [authRequest?.codeVerifier, authResult, setUser]);

  return {
    authenticate,
    isLoading,
    error,
    authRequest,
    authResult,
    signOut,
  };
};
