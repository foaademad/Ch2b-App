import { useRouter } from 'expo-router';
import { ArrowLeft, Edit2, Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useLanguage } from '../src/context/LanguageContext';

interface Address {
  id: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isRTL } = useLanguage();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: '',
  });

  const handleAddAddress = () => {
    setIsAddingAddress(true);
    setFormData({
      fullName: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      phone: '',
    });
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      address: address.address,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      phone: address.phone,
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
    Toast.show({
      type: 'success',
      text1: t('profile.addresses.delete_success'),
      position: 'top',
    });
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
    Toast.show({
      type: 'success',
      text1: t('profile.addresses.set_default_success'),
      position: 'top',
    });
  };

  const handleSaveAddress = () => {
    if (!formData.fullName || !formData.address || !formData.city || 
        !formData.state || !formData.country || !formData.postalCode || !formData.phone) {
      Toast.show({
        type: 'error',
        text1: t('Error'),
        text2: t('profile.addresses.fill_all_fields'),
        position: 'top',
      });
      return;
    }

    if (editingAddress) {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? { ...addr, ...formData } : addr
      ));
      setEditingAddress(null);
    } else {
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, newAddress]);
    }

    setIsAddingAddress(false);
    setFormData({
      fullName: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      phone: '',
    });

    Toast.show({
      type: 'success',
      text1: editingAddress ? t('profile.addresses.edit_success') : t('profile.addresses.add_success'),
      position: 'top',
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, isRTL && styles.backButtonRTL]}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>{t('profile.addresses.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {addresses.length === 0 && !isAddingAddress && !editingAddress && (
          <Text style={[styles.noAddressesText, isRTL && styles.textRTL]}>
            {t('profile.addresses.no_addresses')}
          </Text>
        )}
        
        {addresses.map((address) => (
          <View key={address.id} style={styles.addressCard}>
            {address.isDefault && (
              <View style={[styles.defaultBadge, isRTL && styles.defaultBadgeRTL]}>
                <Text style={styles.defaultText}>{t('profile.addresses.default')}</Text>
              </View>
            )}
            <View style={[styles.addressHeader, isRTL && styles.addressHeaderRTL]}>
              <Text style={[styles.addressName, isRTL && styles.textRTL]}>{address.fullName}</Text>
              <View style={[styles.addressActions, isRTL && styles.addressActionsRTL]}>
                <TouchableOpacity onPress={() => handleEditAddress(address)} style={styles.actionButton}>
                  <Edit2 size={20} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAddress(address.id)} style={styles.actionButton}>
                  <Trash2 size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.addressText, isRTL && styles.textRTL]}>{address.address}</Text>
            <Text style={[styles.addressText, isRTL && styles.textRTL]}>
              {address.city}, {address.state} {address.postalCode}
            </Text>
            <Text style={[styles.addressText, isRTL && styles.textRTL]}>{address.country}</Text>
            <Text style={[styles.addressText, isRTL && styles.textRTL]}>{address.phone}</Text>
            {!address.isDefault && (
              <TouchableOpacity 
                style={styles.setDefaultButton}
                onPress={() => handleSetDefault(address.id)}
              >
                <Text style={styles.setDefaultText}>{t('profile.addresses.set_default')}</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {(isAddingAddress || editingAddress) && (
          <View style={styles.formContainer}>
            <Text style={[styles.formTitle, isRTL && styles.textRTL]}>
              {editingAddress ? t('profile.addresses.edit') : t('profile.addresses.add_new')}
            </Text>
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={t('profile.addresses.name')}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              textAlign={isRTL ? 'right' : 'left'}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={t('profile.addresses.address')}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              textAlign={isRTL ? 'right' : 'left'}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={t('profile.addresses.city')}
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              textAlign={isRTL ? 'right' : 'left'}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={t('profile.addresses.state')}
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
              textAlign={isRTL ? 'right' : 'left'}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={t('profile.addresses.country')}
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text })}
              textAlign={isRTL ? 'right' : 'left'}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={t('profile.addresses.postal_code')}
              value={formData.postalCode}
              onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
              keyboardType="numeric"
              textAlign={isRTL ? 'right' : 'left'}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={t('profile.addresses.phone')}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
              textAlign={isRTL ? 'right' : 'left'}
            />
            <View style={[styles.formButtons, isRTL && styles.formButtonsRTL]}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsAddingAddress(false);
                  setEditingAddress(null);
                }}
              >
                <Text style={styles.cancelButtonText}>{t('Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveAddress}
              >
                <Text style={styles.saveButtonText}>{t('profile.addresses.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!isAddingAddress && !editingAddress && (
          <TouchableOpacity style={[styles.addButton, isRTL && styles.addButtonRTL]} onPress={handleAddAddress}>
            <Plus size={24} color="#fff" />
            <Text style={[styles.addButtonText, isRTL && styles.addButtonTextRTL]}>
              {t('profile.addresses.add_new')}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  defaultBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  addressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  setDefaultButton: {
    marginTop: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  setDefaultText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#36c7f6',
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backButtonRTL: {
    marginRight: 0,
    marginLeft: 16,
  },
  textRTL: {
    textAlign: 'right',
  },
  defaultBadgeRTL: {
    right: 'auto',
    left: 12,
  },
  addressHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  addressActionsRTL: {
    flexDirection: 'row-reverse',
  },
  inputRTL: {
    textAlign: 'right',
  },
  formButtonsRTL: {
    flexDirection: 'row-reverse',
  },
  addButtonRTL: {
    flexDirection: 'row-reverse',
  },
  addButtonTextRTL: {
    marginLeft: 0,
    marginRight: 8,
  },
  noAddressesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
}); 