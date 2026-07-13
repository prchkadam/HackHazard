import { useState } from 'react';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let GoogleSignin: any = null;

if (!isExpoGo) {
  try {
    GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  } catch (error) {
    console.warn('Failed to load GoogleSignin:', error);
  }
}

export function useGoogleAuth() {
  const [idToken, setIdToken] = useState<string | null>(null);

  const promptAsync = async () => {
    if (isExpoGo || !GoogleSignin) {
      throw new Error('Google Sign-In is not supported in Expo Go. Please use Guest mode.');
    }
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
    isReady: !isExpoGo && !!GoogleSignin,
  };
}
