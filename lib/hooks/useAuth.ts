import env from '@/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  refreshAsync,
  type TokenResponse,
  useAuthRequest,
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { getDefaultStore, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useEffect, useState } from 'react';
import { userAtom } from '../atoms/user-atom';
import { me } from '../services/auth';

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

const saveTokenResponse = async (tokenResponse: TokenResponse) => {
  if (tokenResponse.accessToken) {
    await AsyncStorage.setItem('session-token', tokenResponse.accessToken);
  }

  if (tokenResponse.refreshToken) {
    await AsyncStorage.setItem('refresh-token', tokenResponse.refreshToken);
  }

  if (tokenResponse.expiresIn) {
    // Subtract 30 seconds from the expiration time to account for potential clock issues
    const expiresAt = Date.now() + (tokenResponse.expiresIn - 30) * 1000;
    await AsyncStorage.setItem('expires-at', expiresAt.toString());
  }
};

export const signOut = async () => {
  const store = getDefaultStore();
  await store.set(userAtom, RESET);
  await AsyncStorage.multiRemove(['session-token', 'refresh-token', 'expires-at']);
};

export const checkSessionToken = async () => {
  const expiresAt = await AsyncStorage.getItem('expires-at');
  if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
    return false;
  }
  return true;
};

export const updateSessionToken = async (skipTokenCheck?: boolean) => {
  if (!skipTokenCheck) {
    const valid = await checkSessionToken();
    if (valid) return;
  }

  const refreshToken = await AsyncStorage.getItem('refresh-token');
  if (!refreshToken) {
    // Sign out the user, we cannot update the session
    await signOut();
    return;
  }

  const result = await refreshAsync({ ...config, refreshToken }, discovery);
  await saveTokenResponse(result);
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
            ...config,
            code: authResult.params.code,
            extraParams: authRequest?.codeVerifier
              ? { code_verifier: authRequest.codeVerifier }
              : undefined,
          },
          discovery
        );

        await saveTokenResponse(tokenResponse);

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
