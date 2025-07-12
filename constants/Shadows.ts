import { Platform } from 'react-native';

export interface ShadowConfig {
  shadowColor?: string;
  shadowOffset?: {
    width: number;
    height: number;
  };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}

export const createShadow = (config: ShadowConfig) => {
  const {
    shadowColor = '#000',
    shadowOffset = { width: 0, height: 2 },
    shadowOpacity = 0.1,
    shadowRadius = 4,
    elevation = 2
  } = config;

  if (Platform.OS === 'web') {
    // Use boxShadow for web - convert to hex with alpha
    const alpha = Math.round(shadowOpacity * 255);
    const hexAlpha = alpha.toString(16).padStart(2, '0');
    const boxShadow = `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px ${shadowColor}${hexAlpha}`;
    return { boxShadow };
  } else {
    // Use native shadow properties for iOS/Android
    return {
      shadowColor,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
      elevation
    };
  }
};

// Predefined shadow styles - completely web-safe
export const Shadows = Platform.OS === 'web' 
  ? {
      // Web-only shadows using boxShadow
      small: { boxShadow: '0px 1px 2px #0000001a' },
      medium: { boxShadow: '0px 2px 4px #0000001a' },
      large: { boxShadow: '0px 4px 8px #0000001a' },
      primary: { boxShadow: '0px 2px 8px #36c7f633' },
      card: { boxShadow: '0px 2px 4px #0000001f' },
      light: { boxShadow: '0px 2px 6px #0000000f' },
      lighter: { boxShadow: '0px 2px 8px #00000012' },
      veryLight: { boxShadow: '0px 2px 2px #00000008' },
      primaryLight: { boxShadow: '0px 2px 4px #36c7f64d' },
      primaryMedium: { boxShadow: '0px 2px 4px #36c7f61f' },
      button: { boxShadow: '0px 4px 8px #36c7f633' },
      icon: { boxShadow: '0px 2px 4px #0000001a' }
    }
  : {
      // Native-only shadows using shadow properties
      small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
      },
      large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4
      },
      primary: {
        shadowColor: '#36c7f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3
      },
      card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2
      },
      light: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2
      },
      lighter: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3
      },
      veryLight: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1
      },
      primaryLight: {
        shadowColor: '#36c7f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2
      },
      primaryMedium: {
        shadowColor: '#36c7f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2
      },
      button: {
        shadowColor: '#36c7f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4
      },
      icon: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
      }
    }; 