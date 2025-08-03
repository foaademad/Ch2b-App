import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../src/context/LanguageContext";

type CategoryChipProps = {
  category: {
    id: number | string;
    name: string;
    icon: string;
  };
  isSelected?: boolean;
  onPress: () => void;
};

const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  isSelected = false,
  onPress,
}) => {

  const { t } = useTranslation();

  const { language } = useLanguage();

  const styles = StyleSheet.create({
    container: {
      flexDirection: language === 'ar' ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: isSelected ? '#FFCDD2' : '#F5F5F5',
      borderRadius: 20,
      marginHorizontal: 6,
      borderWidth: 1,
      borderColor: isSelected ? '#FF5252' : '#BDBDBD',
    },
    icon: {
      fontSize: 18,
      marginRight: language === 'ar' ? 0 : 8,
      marginLeft: language === 'ar' ? 8 : 0,
    },
    name: {
      fontSize: 14,
      color: isSelected ? '#FF5252' : '#BDBDBD',
      fontFamily: 'Roboto-Medium',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.icon}>{category.icon}</Text>
      <Text style={styles.name}>{t(category.name)}</Text>
    </TouchableOpacity>
  );
};

export default CategoryChip;