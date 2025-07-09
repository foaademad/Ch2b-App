import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Search } from 'lucide-react-native';

type HeaderProps = {
  showBack?: boolean;
  onBackPress?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBackPress,
}) => {
  const { colors } = useTheme();
  const { isRTL } = useLanguage();
  const router = useRouter();

  const styles = StyleSheet.create({
    header: {
      backgroundColor: colors.background,
      paddingTop: 16,
      paddingBottom: 10,
      paddingHorizontal: 16,
    },
    searchContainer: {
      flex: 1,
    },
    searchBar: {
      height: 40,
      backgroundColor: colors.card,
      borderRadius: 8,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
      color: colors.text,
      textAlign: isRTL ? 'right' : 'left',
      fontFamily: 'Roboto-Regular',
    },
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default Header;