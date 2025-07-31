import { Dimensions, StyleSheet } from "react-native";
    const { width: windowWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
      height: 180,
      width: windowWidth,
    },
    scrollContainer: {
      height: 180,
    },
    slide: {
      width: windowWidth,
      height: 180,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: windowWidth - 32,
      height: 180,
      borderRadius: 12,
    },
    textOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    title: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    pagination: {
      position: 'absolute',
      bottom: 16,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    activeDot: {
      width: 12,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
      backgroundColor: '#fff',
    },
    noDataText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
  });
