import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Toast from "react-native-toast-message";
import * as Yup from "yup";
import { Shadows } from "../constants/Shadows";
import { useLanguage } from "../src/context/LanguageContext";
import { resendConfirmation } from "../src/store/api/authApi";
import { useDispatch } from "react-redux";
// مخطط التحقق من صحة الإدخال باستخدام Yup
const ResendConfirmationSchema = (t: any) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t("resend_confirmation.email_invalid"))
      .required(t("resend_confirmation.email_required")),
  });


const ResendConfirmationScreen = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isRTL, setIsRTL] = useState(language === "ar");
  const router = useRouter();
  const [balls] = useState(() => Array(5).fill(0).map(() => ({
    x: new Animated.Value(Math.random() * Dimensions.get('window').width),
    y: new Animated.Value(Math.random() * Dimensions.get('window').height),
    size: Math.random() * 50 + 50,
  })));
  const dispatch = useDispatch();
  useEffect(() => {
    setIsRTL(language === "ar");
  }, [language]);
   
  // Animation balls for background
  useEffect(() => {
    const animateBalls = () => {
      const animations = balls.map(ball => {
        return Animated.parallel([
          Animated.sequence([
            Animated.timing(ball.x, {
              toValue: Math.random() * Dimensions.get('window').width,
              duration: 5000 + Math.random() * 5000,
              useNativeDriver: false,
            }),
            Animated.timing(ball.x, {
              toValue: Math.random() * Dimensions.get('window').width,
              duration: 5000 + Math.random() * 5000,
              useNativeDriver: false,
            }),
          ]),
          Animated.sequence([
            Animated.timing(ball.y, {
              toValue: Math.random() * Dimensions.get('window').height,
              duration: 5000 + Math.random() * 5000,
              useNativeDriver: false,
            }),
            Animated.timing(ball.y, {
              toValue: Math.random() * Dimensions.get('window').height,
              duration: 5000 + Math.random() * 5000,
              useNativeDriver: false,
            }),
          ]),
        ]);
      });

      Animated.parallel(animations).start(() => animateBalls());
    };

    animateBalls();
  }, [balls]);

  // Resend Confirmation Email
  const handleResendConfirmation = async (values: any, { setSubmitting }: any) => {
     dispatch(resendConfirmation(values.email) as any);
     setSubmitting(false);
      Toast.show({
        type: "success",
        text1: t("resend_confirmation.success_title"),
        text2: t("resend_confirmation.success_message"),
        position: "top",
      });
      
      // العودة لصفحة تسجيل الدخول
      router.back();
    
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, isRTL && { direction: "rtl" }]}>
        {balls.map((ball, index) => (
          <Animated.View
            key={index}
            style={[
              styles.ball,
              {
                width: ball.size,
                height: ball.size,
                transform: [
                  { translateX: ball.x },
                  { translateY: ball.y },
                ],
                backgroundColor: `rgba(54, 199, 246, ${0.1 + index * 0.1})`,
              },
            ]}
          />
        ))}
        <View style={[styles.wrapper, styles.blurContainer]}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>{t("resend_confirmation.title")}</Text>
            <Text style={styles.headerSubtitle}>{t("resend_confirmation.subtitle")}</Text>
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            {/* Back to Login Link */}
            <TouchableOpacity 
              onPress={() => router.back()}
              style={[styles.backLink, isRTL && { alignItems: "flex-end" }]}
            >
              <Text style={styles.backLinkText}>{t("resend_confirmation.back_to_login")}</Text>
            </TouchableOpacity>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={ResendConfirmationSchema(t)}
              onSubmit={handleResendConfirmation}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
              }) => (
                <View style={[styles.form, isRTL && { alignItems: "flex-end" }]}>
                  {/* Email Input */}
                  <View style={styles.emailLabelContainer}>
                    <Text style={[styles.emailLabel, isRTL && { textAlign: "right" }]}>
                      {t("resend_confirmation.email_label")}
                    </Text>
                  </View>
                  
                  <View
                    style={[
                      styles.inputContainer,
                      isRTL && { flexDirection: "row-reverse" },
                    ]}
                  >
                    <Ionicons name="mail-outline" size={20} color="#333" />
                    <TextInput
                      style={[styles.input, isRTL && { textAlign: "right" }]}
                      placeholder={t("resend_confirmation.email_placeholder")}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={[styles.errorText, isRTL && { textAlign: "right" }]}>
                      {errors.email}
                    </Text>
                  )}

                  {/* Resend Button */}
                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.resendButtonText}>
                      {isSubmitting ? t("resend_confirmation.sending") : t("resend_confirmation.resend_button")}
                    </Text>
                  </TouchableOpacity>

                  {/* Remember Password Link */}
                  <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.rememberPasswordContainer}
                  >
                    <Text style={[styles.rememberPasswordText, isRTL && { textAlign: "center" }]}>
                      {t("resend_confirmation.remember_password")}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </>
  );
};

export default ResendConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f7fa",
    overflow: "hidden",
  },
  ball: {
    position: "absolute",
    borderRadius: 1000,
    opacity: 0.6,
  },
  wrapper: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    overflow: "hidden",
    ...Shadows.large,
  },
  blurContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  headerSection: {
    backgroundColor: "#36C7F6",
    padding: 30,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    opacity: 0.9,
  },
  contentSection: {
    padding: 30,
    backgroundColor: "#fff",
  },
  backLink: {
    marginBottom: 20,
  },
  backLinkText: {
    color: "#36C7F6",
    fontSize: 14,
    fontWeight: "500",
  },
  form: {
    width: "100%",
  },
  emailLabelContainer: {
    marginBottom: 8,
  },
  emailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    height: 54,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 8,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
    textAlign: "left",
  },
  resendButton: {
    backgroundColor: "#36C7F6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
    ...Shadows.primary,
  },
  resendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  rememberPasswordContainer: {
    alignItems: "center",
  },
  rememberPasswordText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
}); 