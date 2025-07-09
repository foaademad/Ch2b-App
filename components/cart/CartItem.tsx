import { useLanguage } from '@/src/context/LanguageContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CartItemProps = {
  item: {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
  };
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onIncrease,
  onDecrease,
}) => {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const router = useRouter();

  const handlePress = () => {
    router.push(`/product/${item.id}`);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: language === 'ar' ? 'row-reverse' : 'row',
      padding: 12,
      marginBottom: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: language === 'ar' ? 0 : 12,
      marginLeft: language === 'ar' ? 12 : 0,
    },
    detailsContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
    topRow: {
      flexDirection: language === 'ar' ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    title: {
      fontSize: 16,
      color: colors.text,
      fontFamily: 'Roboto-Medium',
      marginBottom: 4,
      flex: 1,
      textAlign: language === 'ar' ? 'right' : 'left',
    },
    removeButton: {
      padding: 4,
    },
    price: {
      fontSize: 16,
      color: colors.primary,
      fontFamily: 'Roboto-Bold',
      marginBottom: 8,
      textAlign: language === 'ar' ? 'right' : 'left',
    },
    bottomRow: {
      flexDirection: language === 'ar' ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    quantityContainer: {
      flexDirection: language === 'ar' ? 'row-reverse' : 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      overflow: 'hidden',
    },
    quantityButton: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    quantityText: {
      width: 32,
      textAlign: 'center',
      fontSize: 14,
      fontFamily: 'Roboto-Medium',
      color: colors.text,
    },
    totalPrice: {
      fontSize: 16,
      color: colors.text,
      fontFamily: 'Roboto-Bold',
      textAlign: language === 'ar' ? 'left' : 'right',
    },
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.detailsContainer}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
            <Trash2 size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        
        <View style={styles.bottomRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={onDecrease}
              disabled={item.quantity <= 1}
            >
              <Minus size={16} color={item.quantity <= 1 ? colors.textSecondary : colors.text} />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.quantity}</Text>
            
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={onIncrease}
            >
              <Plus size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.totalPrice}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CartItem;