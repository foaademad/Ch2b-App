
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { Provider, useDispatch } from 'react-redux';
import '../src/config/i18n';
import { LanguageProvider } from '../src/context/LanguageContext';
import { getCartItems } from '../src/store/api/cartApi';
import { getWishlist } from '../src/store/api/wishlistApi';
import { loadAuthFromStorage } from '../src/store/slice/authSlice';
import { store } from '../src/store/store';

// Suppress deprecation warnings
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string') {
      // Suppress pointerEvents deprecation warning
      if (message.includes('props.pointerEvents is deprecated')) {
        return;
      }
      // Suppress shadow deprecation warning
      if (message.includes('shadow*" style props are deprecated')) {
        return;
      }
    }
    originalWarn.apply(console, args);
  };
}

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
        // تحميل بيانات السلة والمفضلة إذا كان المستخدم مسجل دخول
        try {
          await Promise.all([
            dispatch(getCartItems() as any),
            dispatch(getWishlist() as any)
          ]);
        } catch (error) {
          console.log("Failed to load cart or wishlist items:", error);
        }
        
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
            <LanguageProvider>
                <AppInitializer>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="signin" options={{ presentation: 'modal' }} />
                            <Stack.Screen name="signup" options={{ presentation: 'modal' }} />
                            <Stack.Screen name="addresses" />
                            <Stack.Screen name="category-products" />
                            <Stack.Screen name="checkout" />
                            <Stack.Screen name="edit-profile" />
                            <Stack.Screen name="notifications" />
                            <Stack.Screen name="orders" />
                            <Stack.Screen name="payment-methods" />
                            <Stack.Screen name="privacy" />
                            <Stack.Screen name="product/[id]" />
                            <Stack.Screen name="settings" />
                            <Stack.Screen name="support" />
                        </Stack>
                        <Toast />
                    </AppInitializer>
                </LanguageProvider>
        </Provider>
    );
}
