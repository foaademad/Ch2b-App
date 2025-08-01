import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Shadows } from "../constants/Shadows";
import { useLanguage } from "../src/context/LanguageContext";
import { forgotPassword } from "../src/store/api/authApi";

// مخطط التحقق من صحة الإدخال باستخدام Yup
const ForgotPasswordSchema = (t: any) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t("forgot_password.email_invalid"))
      .required(t("forgot_password.email_required")),
  });


const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isRTL, setIsRTL] = useState(language === "ar");
  const router = useRouter();
  const dispatch = useDispatch();
  React.useEffect(() => {
    setIsRTL(language === "ar");
  }, [language]);



  // معالجة إرسال طلب إعادة تعيين كلمة المرور
  const handleResetPassword = async (values: any, { setSubmitting }: any) => {
    const result = await dispatch<any>(forgotPassword(values.email));
    setSubmitting(false);

    if (result && result.success) {
      Toast.show({
        type: "success",
        text1: t("forgot_password.success_title"),
        text2: t("forgot_password.success_message"),
        position: "top",
      });
      
      // العودة إلى صفحة تسجيل الدخول بعد ثانيتين
      setTimeout(() => {
        router.back();
      }, 2000);
    } else {
      Toast.show({
        type: "error",
        text1: t("forgot_password.error_title"),
        text2: result?.error || t("forgot_password.error_message"),
        position: "top",
      });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {t("forgot_password.title")}
            </Text>
            <Text style={styles.headerSubtitle}>
              {t("forgot_password.subtitle")}
            </Text>
          </View>

          {/* Content Section */}
          <View style={styles.content}>
            <Text style={styles.instructionText}>
              {t("forgot_password.instruction")}
            </Text>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={ForgotPasswordSchema(t)}
              onSubmit={handleResetPassword}
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
                <View style={styles.form}>
                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>
                      {t("forgot_password.email_label")}
                    </Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color="#666"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={[
                          styles.input,
                          isRTL && { textAlign: "right" },
                        ]}
                        placeholder={t("forgot_password.email_placeholder")}
                        placeholderTextColor="#999"
                        value={values.email}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  {/* Reset Password Button */}
                  <TouchableOpacity
                    style={[
                      styles.resetButton,
                      isSubmitting && styles.resetButtonDisabled,
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.resetButtonText}>
                      {isSubmitting
                        ? t("forgot_password.sending")
                        : t("forgot_password.reset_button")}
                    </Text>
                  </TouchableOpacity>

                  {/* Back to Login Link */}
                  <TouchableOpacity
                    style={styles.backLink}
                    onPress={() => router.back()}
                  >
                    <Ionicons
                      name="arrow-back"
                      size={16}
                      color="#36C7F6"
                      style={[styles.backIcon, isRTL && styles.backIconRTL]}
                    />
                    <Text style={styles.backLinkText}>
                      {t("forgot_password.back_to_login")}
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

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f7fa",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    ...Shadows.large,
  },
  header: {
    backgroundColor: "#36C7F6",
    paddingVertical: 30,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
  },
  content: {
    padding: 30,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 54,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  resetButton: {
    backgroundColor: "#36C7F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 24,
    ...Shadows.primary,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    marginRight: 8,
  },
  backIconRTL: {
    marginRight: 0,
    marginLeft: 8,
    transform: [{ scaleX: -1 }],
  },
  backLinkText: {
    color: "#36C7F6",
    fontSize: 14,
    fontWeight: "500",
  },
}); 