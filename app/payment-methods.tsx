import { useRouter } from 'expo-router';
import { CreditCard, Plus, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../src/context/LanguageContext';

interface Card {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault: boolean;
}

const PaymentMethodsScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      cardNumber: '**** **** **** 4242',
      cardHolder: 'John Doe',
      expiryDate: '12/25',
      isDefault: true,
    },
  ]);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleAddCard = () => {
    setIsAddModalVisible(true);
  };

  const handleSaveCard = () => {
    // Validate inputs
    if (!newCard.cardNumber || !newCard.cardHolder || !newCard.expiryDate || !newCard.cvv) {
      Alert.alert(t('error'), 'Please fill in all fields');
      return;
    }

    // Validate card number
    if (newCard.cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert(t('error'), 'Please enter a valid 16-digit card number');
      return;
    }

    // Validate expiry date
    const [month, year] = newCard.expiryDate.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (
      parseInt(month) < 1 ||
      parseInt(month) > 12 ||
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      Alert.alert(t('error'), 'Please enter a valid expiry date');
      return;
    }

    // Validate CVV
    if (newCard.cvv.length < 3 || newCard.cvv.length > 4) {
      Alert.alert(t('error'), 'Please enter a valid CVV (3-4 digits)');
      return;
    }

    // Add new card
    const card: Card = {
      id: Date.now().toString(),
      cardNumber: `**** **** **** ${newCard.cardNumber.slice(-4)}`,
      cardHolder: newCard.cardHolder,
      expiryDate: newCard.expiryDate,
      isDefault: cards.length === 0,
    };

    setCards([...cards, card]);
    setIsAddModalVisible(false);
    setNewCard({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
    Alert.alert(t('success'), 'Card added successfully');
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCards(cards.filter(card => card.id !== cardId));
            Alert.alert(t('success'), 'Card deleted successfully');
          },
        },
      ]
    );
  };

  const handleSetDefault = (cardId: string) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === cardId,
    })));
    Alert.alert(t('success'), 'Default card updated successfully');
  };

  return (
    <ScrollView style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <X size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('profile.payment_methods.title')}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
          <Plus size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {cards.length === 0 ? (
          <View style={styles.emptyState}>
            <CreditCard size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>{t('profile.payment_methods.no_cards')}</Text>
            <TouchableOpacity style={styles.addCardButton} onPress={handleAddCard}>
              <Text style={styles.addCardButtonText}>{t('profile.payment_methods.add_new')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cards.map(card => (
            <View key={card.id} style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <CreditCard size={24} color="#2196F3" />
                <Text style={styles.cardType}>Visa</Text>
                {card.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>{t('profile.payment_methods.default')}</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.cardNumber}>{card.cardNumber}</Text>
              <Text style={styles.cardHolder}>{card.cardHolder}</Text>
              <Text style={styles.expiryDate}>{card.expiryDate}</Text>

              <View style={styles.cardActions}>
                {!card.isDefault && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleSetDefault(card.id)}
                  >
                    <Text style={styles.actionButtonText}>
                      {t('profile.payment_methods.set_default')}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteCard(card.id)}
                >
                  <Trash2 size={16} color="#ff3b30" />
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                    {t('profile.payment_methods.delete')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Card</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  value={newCard.cardNumber}
                  onChangeText={(text) => setNewCard(prev => ({
                    ...prev,
                    cardNumber: formatCardNumber(text)
                  }))}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Card Holder Name</Text>
                <TextInput
                  style={styles.input}
                  value={newCard.cardHolder}
                  onChangeText={(text) => setNewCard(prev => ({
                    ...prev,
                    cardHolder: text
                  }))}
                  placeholder="Enter card holder name"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    value={newCard.expiryDate}
                    onChangeText={(text) => setNewCard(prev => ({
                      ...prev,
                      expiryDate: formatExpiryDate(text)
                    }))}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    value={newCard.cvv}
                    onChangeText={(text) => setNewCard(prev => ({
                      ...prev,
                      cvv: text
                    }))}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveCard}>
                <Text style={styles.saveButtonText}>Save Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 40,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  addCardButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addCardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultBadgeText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '600',
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardHolder: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  deleteButtonText: {
    color: '#ff3b30',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentMethodsScreen; 