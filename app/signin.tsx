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
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useLanguage } from "../src/context/LanguageContext";
import { loginUser } from "../src/store/api/authApi";


// مخطط التحقق من صحة الإدخال باستخدام Yup
const LoginSchema = (t: any) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t("login.email_invalid"))
      .required(t("login.email_required")),
    password: Yup.string()
      .min(6, t("login.password_min"))
      .required(t("login.password_required")),
  });

type Props = {};
const LoginScreen = (props: Props) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isRTL, setIsRTL] = useState(language === "ar");
  const [showPassword, setShowPassword] = useState(false);
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
              useNativeDriver: true,
            }),
            Animated.timing(ball.x, {
              toValue: Math.random() * Dimensions.get('window').width,
              duration: 5000 + Math.random() * 5000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(ball.y, {
              toValue: Math.random() * Dimensions.get('window').height,
              duration: 5000 + Math.random() * 5000,
              useNativeDriver: true,
            }),
            Animated.timing(ball.y, {
              toValue: Math.random() * Dimensions.get('window').height,
              duration: 5000 + Math.random() * 5000,
              useNativeDriver: true,
            }),
          ]),
        ]);
      });

      Animated.parallel(animations).start(() => animateBalls());
    };

    animateBalls();
  }, []);

  // Login
  const handleLogin = async (values: any, { setSubmitting }: any) => {
    const result = await dispatch<any>(loginUser(values));
    setSubmitting(false);
  
    if (result && result.success) {
      Toast.show({
        type: "success",
        text1: t("login.login_success"),
        text2: t("login.login_success_description"),
        position: "top",
      });
      router.push({ pathname: "/(tabs)" });
    } else {
      if (result?.errorType === "email_confirmation") {
        Toast.show({
          type: "error",
          text1: "Email needs confirmation",
          text2: "Please check your email to confirm your account before logging in.",
          position: "top",
        });
      } else if (result?.errorType === "invalid_credentials") {
        Toast.show({
          type: "error",
          text1: "Invalid email or password",
          text2: "Please check your credentials and try again.",
          position: "top",
        });
      } else {
        Toast.show({
          type: "error",
          text1: t("login.error"),
          text2: result?.error || t("login.login_failed"),
          position: "top",
        });
      }
    }
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
          <Text style={[styles.title]}>{t("login.title")}</Text>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema(t)}
            onSubmit={handleLogin}
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
                <View
                  style={[
                    styles.inputContainer,
                    isRTL && { flexDirection: "row-reverse" },
                  ]}
                >
                  <Ionicons name="mail-outline" size={20} color="#333" />
                  <TextInput
                    style={[styles.input, isRTL && { textAlign: "right" }]}
                    placeholder={t("login.email")}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* Password Input */}
                <View
                  style={[
                    styles.inputContainer,
                    isRTL && { flexDirection: "row-reverse" },
                  ]}
                >
                  <Ionicons name="lock-closed-outline" size={20} color="#333" />
                  <TextInput
                    style={[styles.input, isRTL && { textAlign: "right" }]}
                    placeholder={t("login.password")}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIconContainer}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#333"
                    />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                {/* Forgot Password */}
                <TouchableOpacity onPress={() => {}}>
                  <Text
                    style={[styles.forgotText, isRTL && { textAlign: "right" }]}
                  >
                    {t("login.forgot_password")}
                  </Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  <Text style={styles.loginButtonText}>
                    {t("login.login_button")}
                  </Text>
                </TouchableOpacity>

                {/* Create Account Link */}
                <TouchableOpacity
                  onPress={() => router.push({ pathname: "/signup" })}
                >
                  <Text style={[styles.signupText]}>
                    {t("login.dont_have_account")}
                    <Text style={styles.signupLink}>{t("login.sign_up")}</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </>
  );
};

export default LoginScreen;
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
    // borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 20,
    backdropFilter: "blur(10px)",
    backgroundColor: "transparent",
  },
  blurContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 12,
    width: "100%",
  },
  socialButtonText: {
    marginLeft: 10,
    color: "#333",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 15,
  },
  form: {
    width: "100%",
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
  eyeIconContainer: {
    padding: 8,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
    textAlign: "left",
  },
  forgotText: {
    color: "#36C7F6",
    fontSize: 14,
    textAlign: "right",
    marginBottom: 24,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#36C7F6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
    shadowColor: "#36C7F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signupText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  signupLink: {
    color: "#36C7F6",
    fontWeight: "600",
    marginLeft: 5,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});