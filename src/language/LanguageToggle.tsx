import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = () => {
  const { language, changeLanguage, isRTL } = useLanguage();
  const targetLanguage = isRTL ? 'en' : 'ar';
  const languageText = targetLanguage === 'en' ? 'EN' : 'AR';

  return (
    <View style={[styles.languageContainer, isRTL && { right: 'auto', left: 10 }]}> 
      <TouchableOpacity
        onPress={() => changeLanguage(targetLanguage)}
        style={styles.languageButton}
      >
        <Ionicons name="globe-outline" size={20} color="#333" />
        <Text style={styles.languageText}>{languageText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  languageContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  languageText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default LanguageToggle; 