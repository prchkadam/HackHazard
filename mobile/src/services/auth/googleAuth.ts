import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const extra = Constants.expoConfig?.extra as {
  googleWebClientId?: string;
  googleIosClientId?: string;
  googleAndroidClientId?: string;
} | undefined;

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: extra?.googleWebClientId ?? process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: extra?.googleIosClientId ?? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: extra?.googleAndroidClientId ?? process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    redirectUri: makeRedirectUri({ scheme: 'mobile' }),
  });

  const idToken = response?.type === 'success' ? response.authentication?.idToken : null;

  return {
    request,
    idToken,
    response,
    promptAsync,
    isReady: Boolean(request),
  };
}
