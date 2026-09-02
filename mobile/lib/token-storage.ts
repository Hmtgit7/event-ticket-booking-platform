import * as SecureStore from "expo-secure-store";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/auth-storage-keys";

/**
 * SecureStore's API is async-only (backed by Keychain/Keystore), unlike
 * js-cookie on web - but api-client.ts needs a synchronous read on every
 * request. Fix: mirror both tokens in memory, kept in sync with SecureStore.
 * The in-memory copy is authoritative for reads; SecureStore is just the
 * persisted backing store, rehydrated once via loadPersisted() on app boot
 * (see store/auth-store.ts's hydrate()).
 */
let accessTokenMemo: string | null = null;
let refreshTokenMemo: string | null = null;

export const tokenStorage = {
  getAccessToken: () => accessTokenMemo,
  getRefreshToken: () => refreshTokenMemo,

  async loadPersisted(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    ]);
    accessTokenMemo = accessToken;
    refreshTokenMemo = refreshToken;
    return { accessToken, refreshToken };
  },

  async setTokens(accessToken: string, refreshToken: string) {
    accessTokenMemo = accessToken;
    refreshTokenMemo = refreshToken;
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  async clear() {
    accessTokenMemo = null;
    refreshTokenMemo = null;
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};
