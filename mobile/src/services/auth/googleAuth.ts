import { useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
});

export function useGoogleAuth() {
  const [idToken, setIdToken] = useState<string | null>(null);

  const promptAsync = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const token = userInfo.data?.idToken ?? null;
      setIdToken(token);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  return {
    promptAsync,
    idToken,
    isReady: true,
  };
}
