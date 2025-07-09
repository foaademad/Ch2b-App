import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = () => {
  const { language, changeLanguage } = useLanguage();
  const [isRTL, setIsRTL] = useState(language === 'ar');

  useEffect(() => {
    setIsRTL(language === 'ar');
  }, [language]);

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

export default LanguageToggle;

const styles = StyleSheet.create({
  languageContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    paddingVertical: 25,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  languageText: {
    marginLeft: 5,
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
});