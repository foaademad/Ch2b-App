import { useLanguage } from '@/src/context/LanguageContext';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronLeft, ChevronUp, Mail, MessageSquare, Phone } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const HelpSupportScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqItems = [
    {
      question: t('profile.help_support.faq_question_1'),
      answer: t('profile.help_support.faq_answer_1'),
    },
    {
      question: t('profile.help_support.faq_question_2'),
      answer: t('profile.help_support.faq_answer_2'),
    },
    {
      question: t('profile.help_support.faq_question_3'),
      answer: t('profile.help_support.faq_answer_3'),
    },
  ];

  const contactOptions = [
    {
      title: t('profile.help_support.email'),
      description: t('profile.help_support.email_description'),
      icon: <Mail size={24} color="#36c7f6" />,
      action: () => {/* Handle email action */},
    },
    {
      title: t('profile.help_support.phone'),
      description: t('profile.help_support.phone_description'),
      icon: <Phone size={24} color="#36c7f6" />,
      action: () => {/* Handle phone action */},
    },
    {
      title: t('profile.help_support.chat'),
      description: t('profile.help_support.chat_description'),
      icon: <MessageSquare size={24} color="#36c7f6" />,
      action: () => {/* Handle chat action */},
    },
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleSubmitTicket = () => {
    // Handle ticket submission
    console.log('Submitting ticket:', { subject, message });
  };

  return (
    <View style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      {/* Header */}
      <View style={[styles.header, { direction: isRTL ? 'rtl' : 'ltr' }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#333" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.help_support.title')}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.help_support.faq')}</Text>
          {faqItems.map((item, index) => (
            <TouchableOpacity
              key={`faq-${item.question}-${index}`}
              style={styles.faqItem}
              onPress={() => toggleFaq(index)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                {expandedFaq === index ? (
                  <ChevronUp size={20} color="#666" />
                ) : (
                  <ChevronDown size={20} color="#666" />
                )}
              </View>
              {expandedFaq === index && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.help_support.contact')}</Text>
          {contactOptions.map((option, index) => (
            <TouchableOpacity
              key={`contact-${option.title}-${index}`}
              style={styles.contactItem}
              onPress={option.action}
            >
              <View style={styles.contactIcon}>{option.icon}</View>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactDescription}>{option.description}</Text>
              </View>
              <ChevronLeft size={20} color="#666" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Ticket */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.help_support.submit_ticket')}</Text>
          <View style={styles.ticketForm}>
            <Text style={styles.inputLabel}>{t('profile.help_support.subject')}</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder={t('profile.help_support.subject_placeholder')}
            />
            <Text style={styles.inputLabel}>{t('profile.help_support.message')}</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              value={message}
              onChangeText={setMessage}
              placeholder={t('profile.help_support.message_placeholder')}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitTicket}
            >
              <Text style={styles.submitButtonText}>{t('profile.help_support.send')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 45,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ticketForm: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#36c7f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HelpSupportScreen; 