import { Ionicons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Shadows } from '../constants/Shadows';
import { useLanguage } from '../src/context/LanguageContext';

const { width } = Dimensions.get('window');

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bounce animation for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation for content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const iconTranslateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <>
      <Stack.Screen options={{ 
        title: t('not_found.title'),
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTitleStyle: {
          color: '#1a1b1c',
          fontSize: 18,
        },
      }} />
      <View style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
        <View style={styles.content}>
          <Animated.View style={[
            styles.iconContainer,
            {
              transform: [{ translateY: iconTranslateY }],
            }
          ]}>
            <Ionicons name="alert-circle-outline" size={120} color="rgb(54, 199, 246)" />
          </Animated.View>
          
          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
            <Text style={styles.title}>{t('not_found.oops')}</Text>
            <Text style={styles.subtitle}>{t('not_found.message')}</Text>
            
            <TouchableOpacity style={styles.button}>
              <Link href="/" style={styles.link}>
                <View style={styles.buttonContent}>
                  <Ionicons name="home-outline" size={20} color="#FFFFFF"  />
                  <Text style={styles.buttonText}>{t('not_found.return_home')}</Text>
                </View>
              </Link>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.decorationContainer}>
            <View style={[styles.decoration, styles.decoration1]} />
            <View style={[styles.decoration, styles.decoration2]} />
            <View style={[styles.decoration, styles.decoration3]} />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
  },
  iconContainer: {
    marginBottom: 30,
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: width * 0.8,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1a1b1c',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  button: {
    backgroundColor: 'rgb(54, 199, 246)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    ...Shadows.primary,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  link: {
    textDecorationLine: 'none',
  },
  decorationContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  decoration: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  decoration1: {
    backgroundColor: 'rgb(54, 199, 246)',
    width: 200,
    height: 200,
    top: '10%',
    left: '5%',
  },
  decoration2: {
    backgroundColor: 'rgb(54, 199, 246)',
    width: 150,
    height: 150,
    bottom: '15%',
    right: '10%',
  },
  decoration3: {
    backgroundColor: '#34C759',
    width: 100,
    height: 100,
    top: '40%',
    right: '25%',
  },
});
