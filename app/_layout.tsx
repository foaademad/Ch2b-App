import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback, useState } from 'react';
import 'react-native-reanimated';
import { LanguageProvider } from '../src/context/LanguageContext';
import { ShopProvider } from '@/src/context/ShopContext';
import Toast from 'react-native-toast-message';
import '../src/config/i18n';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from '../src/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadAuthFromStorage } from '../src/store/slice/authSlice';
import { View, ActivityIndicator } from 'react-native';

SplashScreen.preventAutoHideAsync();

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState<null | "index" | "tabs">(null);

  const initializeApp = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("authModelAdmin");
      const parsed = stored ? JSON.parse(stored) : null;
      console.log("parsed from AsyncStorage:", parsed);

      dispatch(loadAuthFromStorage(parsed));

      if (parsed?.result?.isAuthenticated) {
        
        setShouldRedirect("tabs");
      } else {
        setShouldRedirect("index");
      }
    } catch (error) {
      console.error("Failed to load auth model:", error);
      setShouldRedirect("index");
    } finally {
      setIsAuthLoaded(true);
      SplashScreen.hideAsync();
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, []);


  useEffect(() => {
    if (isAuthLoaded && shouldRedirect) {
      router.replace(shouldRedirect === "tabs" ? "/(tabs)" : "/");
    }
  }, [isAuthLoaded, shouldRedirect]);

  if (!isAuthLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return <>{children}</>;
}


export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Provider store={store}>
            <ShopProvider>
                <LanguageProvider>
                    <AppInitializer>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="signin" options={{ presentation: 'modal' }} />
                            <Stack.Screen name="signup" options={{ presentation: 'modal' }} />
                        </Stack>
                        <Toast />
                    </AppInitializer>
                </LanguageProvider>
            </ShopProvider>
        </Provider>
    );
}
