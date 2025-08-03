import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Animated,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Shadows } from "../constants/Shadows";
import { useLanguage } from "../src/context/LanguageContext";
import { registerUser } from "../src/store/api/authApi";
import { RootState } from "../src/store/store";

interface FormValues {
  username: string;
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  businessRegNumber: string;
  Phone: string;
  companyType: string;
  companyImage: string;
}

// مخطط التحقق من صحة الإدخال باستخدام Yup للمستخدم العادي
const RegularUserSchema = (t: any) =>
  Yup.object().shape({
    username: Yup.string()
      .min(3, t("signup.username_min"))
      .required(t("signup.username_required")),
    email: Yup.string()
      .email(t("signup.email_invalid"))
      .required(t("signup.email_required")),
    password: Yup.string()
      .min(6, t("signup.password_min"))
      .required(t("signup.password_required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("signup.passwords_must_match"))
      .required(t("signup.confirm_password_required")),
    Phone: Yup.string().required(t("signup.Phone_required")),
  });

// مخطط التحقق من صحة الإدخال باستخدام Yup للشركة
const getCompanySchema = (t: any) => {
  return Yup.object().shape({
    companyName: Yup.string()
      .min(3, t("signup.company_name_min"))
      .required(t("signup.company_name_required")),
    email: Yup.string()
      .email(t("signup.email_invalid"))
      .required(t("signup.email_required")),
    password: Yup.string()
      .min(6, t("signup.password_min"))
      .required(t("signup.password_required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("signup.passwords_must_match"))
      .required(t("signup.confirm_password_required")),
    address: Yup.string().required(t("signup.address_required")),
    businessRegNumber: Yup.string().required(
      t("signup.business_reg_number_required")
    ),
    Phone: Yup.string().required(t("signup.Phone_required")),
    companyType: Yup.string().required(t("signup.company_type_required")),
    companyImage: Yup.string().when('companyType', {
      is: 'company',
      then: (schema) => schema.required(t("signup.company_image_required")),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
};

const getValidationSchema = (t: any, accountType: string) => {
  return accountType === "company" ? getCompanySchema(t) : RegularUserSchema(t);
};

const SignupScreen = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isRTL, setIsRTL] = useState(language === "ar");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("user"); // user, company
  const [userType, setUserType] = useState("regular"); // regular, marketer
  const [step, setStep] = useState(1); // step=1 -> basic info, step=2 -> company details
  const [businessType, setBusinessType] = useState("store"); // store or company
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [balls] = useState(() =>
    Array(5)
      .fill(0)
      .map(() => ({
        x: new Animated.Value(Math.random() * Dimensions.get('window').width),
        y: new Animated.Value(Math.random() * Dimensions.get('window').height),
        size: Math.random() * 50 + 50,
      }))
  );

  useEffect(() => {
    setIsRTL(language === "ar");
  }, [language]);

  // تحريك الكرات
  useEffect(() => {
    const animateBalls = () => {
      const animations = balls.map((ball) => {
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

  // طلب إذن المعرض
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Toast.show({
            type: 'error',
            text1: t("signup.permission_required"),
            text2: t("signup.camera_permission_message"),
            position: 'top',
          });
        }
      }
    })();
  }, [t]);

  const getInitialValues = (): FormValues => {
    if (accountType === "company") {
      return {
        username: "",
        companyName: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        businessRegNumber: "",
        Phone: "",
        companyType: "store",
        companyImage: "",
      };
    } else {
      return {
        username: "",
        companyName: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        businessRegNumber: "",
        Phone: "",
        companyType: "",
        companyImage: "",
      };
    }
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      if (values.password !== values.confirmPassword) {
        Toast.show({
          type: 'error',
          text1: t('signup.error'),
          text2: t('signup.passwords_must_match'),
          position: 'top',
        });
        setSubmitting(false);
        return;
      }
      const isCompany = accountType === "company";
      const isMarketer = userType === "marketer";
      const isComanyOrShop = isCompany && businessType === "store";
      // تحقق من رفع صورة إذا كان نوع الحساب شركة ونوع النشاط company فقط
      if (isCompany && businessType === "company" && !imageUri) {
        Toast.show({
          type: 'error',
          text1: t('signup.error'),
          text2: t('signup.company_image_required'),
          position: 'top',
        });
        setSubmitting(false);
        return;
      }
      const data: any = {
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        isComanyOrShop: isComanyOrShop,
        isMarketer: isMarketer,
        isComapny: isCompany,
        location: isCompany ? values.address : "",
        fullName: isCompany ? values.companyName : values.username,
        phoneNumber: values.Phone,
      };
      if (isCompany) {
        data.CommercialRegister = imageUri || "";
      }
      // dispatch registerUser
      const result = await dispatch<any>(registerUser(data));
      if (result && result.success) {
        Toast.show({
          type: 'success',
          text1: t('signup.success'),
          text2: t('signup.registration_successful'),
          position: 'top',
          onHide: () => {
            // الانتقال إلى صفحة تسجيل الدخول بعد التسجيل الناجح
            router.replace("/signin");
          },
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('signup.error'),
          text2: result?.error || t('signup.registration_failed'),
          position: 'top',
        });
      }
      setSubmitting(false);
    } catch (error: any) {
      const errorMessage = error?.message || t("signup.registration_failed");
      Toast.show({
        type: 'error',
        text1: t('signup.error'),
        text2: errorMessage,
        position: 'top',
      });
      setSubmitting(false);
    }
  };

  const pickImage = async (handleChange: (field: string, value: any) => void) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageName(asset.uri.split("/").pop() || t("signup.image_uploaded"));
        handleChange("companyImage", asset.uri);
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('signup.error'),
        text2: t('signup.image_pick_error'),
        position: 'top',
      });
    }
  };

  const removeImage = (handleChange: (field: string, value: any) => void) => {
    setImageUri(null);
    setImageName(null);
    handleChange("companyImage", "");
  };

  const handleChangeType = (field: string) => (value: any) => {
    if (field === "companyType") {
      setBusinessType(value);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, isRTL && { direction: "rtl" }]}>
          {balls.map((ball, index) => (
            <Animated.View
              key={index}
              style={[
                styles.ball,
                {
                  width: ball.size,
                  height: ball.size,
                  transform: [{ translateX: ball.x }, { translateY: ball.y }],
                  backgroundColor: `rgba(54, 199, 246, ${0.1 + index * 0.1})`,
                },
              ]}
            />
          ))}
          <View style={[styles.wrapper, styles.blurContainer]}>
            <Text style={styles.title}>{t("signup.title")}</Text>

            {/* اختيار نوع الحساب */}
            <View style={styles.accountTypeContainer}>
              <Text style={styles.accountTypeLabel}>
                {t("signup.account_type")}
              </Text>
              <View style={styles.accountTypeOptions}>
                <TouchableOpacity
                  style={[
                    styles.accountTypeButton,
                    accountType === "user" && styles.activeButton,
                  ]}
                  onPress={() => {
                    setAccountType("user");
                    setStep(1);
                  }}
                >
                  <Text
                    style={[
                      styles.accountTypeButtonText,
                      accountType === "user" && styles.activeButtonText,
                    ]}
                  >
                    {t("signup.user_account")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.accountTypeButton,
                    accountType === "company" && styles.activeButton,
                  ]}
                  onPress={() => {
                    setAccountType("company");
                    setStep(1);
                    setBusinessType("store");
                  }}
                >
                  <Text
                    style={[
                      styles.accountTypeButtonText,
                      accountType === "company" && styles.activeButtonText,
                    ]}
                  >
                    {t("signup.company_account")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* اختيار نوع المستخدم */}
            {accountType === "user" && (
              <View style={styles.userTypeContainer}>
                <Text style={styles.userTypeLabel}>
                  {t("signup.user_type")}
                </Text>
                <View style={styles.userTypeOptions}>
                  <TouchableOpacity
                    style={[
                      styles.userTypeButton,
                      userType === "regular" && styles.activeButton,
                    ]}
                    onPress={() => setUserType("regular")}
                  >
                    <Text
                      style={[
                        styles.userTypeButtonText,
                        userType === "regular" && styles.activeButtonText,
                      ]}
                    >
                      {t("signup.regular_user")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.userTypeButton,
                      userType === "marketer" && styles.activeButton,
                    ]}
                    onPress={() => setUserType("marketer")}
                  >
                    <Text
                      style={[
                        styles.userTypeButtonText,
                        userType === "marketer" && styles.activeButtonText,
                      ]}
                    >
                      {t("signup.marketer")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Formik<FormValues>
              initialValues={getInitialValues()}
              validationSchema={getValidationSchema(t, accountType)}
              onSubmit={handleSubmit}
              enableReinitialize
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
                  {/* مؤشر التقدم فقط لحساب الشركة */}
                  {accountType === "company" && (
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[styles.progressBar, { width: `${step === 1 ? 50 : 100}%` }]}
                      />
                      <Text style={styles.progressLabel}>
                        {step === 1 ? t("signup.step_1_of_2") : t("signup.step_2_of_2")}
                      </Text>
                    </View>
                  )}

                  {/* الخطوة الأولى */}
                  {accountType === "company" && step === 1 && (
                    <>
                      {/* اسم الشركة */}
                      <View
                        style={[styles.inputContainer, isRTL && { flexDirection: "row-reverse" }]}
                      >
                        <Ionicons name="business-outline" size={20} color="#333" />
                        <TextInput
                          style={[styles.input, isRTL && { textAlign: "right" }]}
                          placeholder={t("signup.company_name")}
                          onChangeText={handleChange("companyName")}
                          onBlur={handleBlur("companyName")}
                          value={values.companyName}
                        />
                      </View>
                      {touched.companyName && errors.companyName && (
                        <Text style={styles.errorText}>{errors.companyName}</Text>
                      )}

                      {/* البريد الإلكتروني */}
                      <View
                        style={[styles.inputContainer, isRTL && { flexDirection: "row-reverse" }]}
                      >
                        <Ionicons name="mail-outline" size={20} color="#333" />
                        <TextInput
                          style={[styles.input, isRTL && { textAlign: "right" }]}
                          placeholder={t("signup.email")}
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

                      {/* كلمة المرور */}
                      <View
                        style={[styles.inputContainer, isRTL && { flexDirection: "row-reverse" }]}
                      >
                        <Ionicons name="lock-closed-outline" size={20} color="#333" />
                        <TextInput
                          style={[styles.input, isRTL && { textAlign: "right" }]}
                          placeholder={t("signup.password")}
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

                      {/* تأكيد كلمة المرور */}
                      <View
                        style={[styles.inputContainer, isRTL && { flexDirection: "row-reverse" }]}
                      >
                        <Ionicons name="lock-closed-outline" size={20} color="#333" />
                        <TextInput
                          style={[styles.input, isRTL && { textAlign: "right" }]}
                          placeholder={t("signup.confirm_password")}
                          onChangeText={handleChange("confirmPassword")}
                          onBlur={handleBlur("confirmPassword")}
                          value={values.confirmPassword}
                          secureTextEntry={!showConfirmPassword}
                          autoCapitalize="none"
                        />
                        <TouchableOpacity
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={styles.eyeIconContainer}
                        >
                          <Ionicons
                            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#333"
                          />
                        </TouchableOpacity>
                      </View>
                      {touched.confirmPassword && errors.confirmPassword && (
                        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                      )}

                      {/* زر التالي */}
                      <TouchableOpacity
                        style={[styles.signupButton, { backgroundColor: "#36C7F6" }]}
                        onPress={() => setStep(2)}
                      >
                        <Text style={styles.signupButtonText}>{t("signup.next_step")}</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {/* الخطوة الثانية */}
                  {accountType === "company" && step === 2 && (
                    <>
                      {/* الهاتف */}
                      <View
                        style={[styles.inputContainer, isRTL && { flexDirection: "row-reverse" }]}
                      >
                        <Ionicons name="phone-portrait-outline" size={20} color="#333" />
                        <TextInput
                          style={[styles.input, isRTL && { textAlign: "right" }]}
                          placeholder={t("signup.Phone")}
                          onChangeText={handleChange("Phone")}
                          onBlur={handleBlur("Phone")}
                          value={values.Phone}
                          keyboardType="phone-pad"
                        />
                      </View>
                      {touched.Phone && errors.Phone && (
                        <Text style={styles.errorText}>{errors.Phone}</Text>
                      )}

                      {/* العنوان */}
                      <View
                        style={[styles.inputContainer, isRTL && { flexDirection: "row-reverse" }]}
                      >
                        <Ionicons name="location-outline" size={20} color="#333" />
                        <TextInput
                          style={[styles.input, isRTL && { textAlign: "right" }]}
                          placeholder={t("signup.company_address")}
                          onChangeText={handleChange("address")}
                          onBlur={handleBlur("address")}
                          value={values.address}
                        />
                      </View>
                      {touched.address && errors.address && (
                        <Text style={styles.errorText}>{errors.address}</Text>
                      )}

                      {/* رقم السجل التجاري */}
                      <View
                        style={[styles.inputContainer, isRTL && { flexDirection: "row-reverse" }]}
                      >
                        <Ionicons name="barcode-outline" size={20} color="#333" />
                        <TextInput
                          style={[styles.input, isRTL && { textAlign: "right" }]}
                          placeholder={t("signup.business_reg_number")}
                          onChangeText={handleChange("businessRegNumber")}
                          onBlur={handleBlur("businessRegNumber")}
                          value={values.businessRegNumber}
                          keyboardType="numeric"
                        />
                      </View>
                      {touched.businessRegNumber && errors.businessRegNumber && (
                        <Text style={styles.errorText}>{errors.businessRegNumber}</Text>
                      )}

                      {/* نوع الشركة */}
                      <View style={styles.companyTypeContainer}>
                        <Text style={styles.companyTypeLabel}>
                          {t("signup.select_company_type")}
                        </Text>
                        <View style={styles.companyTypeOptions}>
                          <TouchableOpacity
                            style={[
                              styles.companyTypeButton,
                              businessType === "store" && styles.activeButton,
                            ]}
                            onPress={() => {
                              setBusinessType("store");
                              handleChangeType("companyType")("store");
                            }}
                          >
                            <Ionicons
                              name="storefront-outline"
                              size={20}
                              color={businessType === "store" ? "#fff" : "#333"}
                            />
                            <Text
                              style={[
                                styles.companyTypeButtonText,
                                businessType === "store" && styles.activeButtonText,
                              ]}
                            >
                              {t("signup.store")}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.companyTypeButton,
                              businessType === "company" && styles.activeButton,
                            ]}
                            onPress={() => {
                              setBusinessType("company");
                              handleChangeType("companyType")("company");
                            }}
                          >
                            <Ionicons
                              name="business-outline"
                              size={20}
                              color={businessType === "company" ? "#fff" : "#333"}
                            />
                            <Text
                              style={[
                                styles.companyTypeButtonText,
                                businessType === "company" && styles.activeButtonText,
                              ]}
                            >
                              {t("signup.company")}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {touched.companyType && errors.companyType && (
                        <Text style={styles.errorText}>{errors.companyType}</Text>
                      )}

                      {/* رفع الصورة */}
                      
                        <View style={[styles.inputContainer, isRTL && { flexDirection: "row-reverse" }]}>
                          <Ionicons name="image-outline" size={20} color="#333" />
                          <View style={styles.imageUploadRow}>
                            <Text style={styles.imageName}>{t("signup.commercial_register_upload")}</Text>
                            {!imageUri ? (
                              <TouchableOpacity
                                style={styles.imageUploadButton}
                                onPress={() => pickImage(handleChange)}
                              >
                                <Text style={styles.imageUploadText}>
                                  {t("signup.upload_image")}
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <>
                                <Text style={styles.imageName}>{imageName}</Text>
                                <TouchableOpacity
                                  style={styles.removeImageButton}
                                  onPress={() => removeImage(handleChange)}
                                >
                                  <Text style={styles.removeIcon}>×</Text>
                                </TouchableOpacity>
                              </>
                            )}
                          </View>
                        </View>
                     
                      {touched.companyImage && errors.companyImage && (
                        <Text style={styles.errorText}>{errors.companyImage}</Text>
                      )}

                      {/* زر إرسال النموذج */}
                      <TouchableOpacity
                        style={[styles.signupButton, loading && styles.disabledButton]}
                        onPress={() => handleSubmit()}
                        disabled={isSubmitting || loading}
                      >
                        <Text style={styles.signupButtonText}>
                          {loading ? t("signup.registering") : t("signup.signup_button")}
                        </Text>
                      </TouchableOpacity>

                      {/* زر العودة */}
                      <TouchableOpacity
                        style={[styles.signupButton, { backgroundColor: "#ccc", marginTop: 10 }]}
                        onPress={() => setStep(1)}
                      >
                        <Text style={styles.signupButtonText}>{t("signup.back")}</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {/* بيانات المستخدم */}
                  {accountType === "user" && (
                    <>
                      {/* اسم المستخدم */}
                      <View
                        style={[styles.inputContainer, isRTL && { flexDirection: "row-reverse" }]}
                      >
                        <Ionicons name="person-outline" size={20} color="#333" />
                        <TextInput
                          style={[styles.input, isRTL && { textAlign: "right" }]}
                          placeholder={t("signup.username")}
                          onChangeText={handleChange("username")}
                          onBlur={handleBlur("username")}
                          value={values.username}
                          autoCapitalize="none"
                        />
                      </View>
                      {touched.username && errors.username && (
                        <Text style={styles.errorText}>{errors.username}</Text>
                      )}

                      {/* البريد الإلكتروني */}
                      <View
                        style={[styles.inputContainer, isRTL && { flexDirection: "row-reverse" }]}
                      >
                        <Ionicons name="mail-outline" size={20} color="#333" />
                        <TextInput
                          style={[styles.input, isRTL && { textAlign: "right" }]}
                          placeholder={t("signup.email")}
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

                      {/* كلمة المرور */}
                      <View
                        style={[styles.inputContainer, isRTL && { flexDirection: "row-reverse" }]}
                      >
                        <Ionicons name="lock-closed-outline" size={20} color="#333" />
                        <TextInput
                          style={[styles.input, isRTL && { textAlign: "right" }]}
                          placeholder={t("signup.password")}
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

                      {/* تأكيد كلمة المرور */}
                      <View
                        style={[styles.inputContainer, isRTL && { flexDirection: "row-reverse" }]}
                      >
                        <Ionicons name="lock-closed-outline" size={20} color="#333" />
                        <TextInput
                          style={[styles.input, isRTL && { textAlign: "right" }]}
                          placeholder={t("signup.confirm_password")}
                          onChangeText={handleChange("confirmPassword")}
                          onBlur={handleBlur("confirmPassword")}
                          value={values.confirmPassword}
                          secureTextEntry={!showConfirmPassword}
                          autoCapitalize="none"
                        />
                        <TouchableOpacity
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={styles.eyeIconContainer}
                        >
                          <Ionicons
                            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#333"
                          />
                        </TouchableOpacity>
                      </View>
                      {touched.confirmPassword && errors.confirmPassword && (
                        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                      )}

                      {/* الهاتف */}
                      <View
                        style={[styles.inputContainer, isRTL && { flexDirection: "row-reverse" }]}
                      >
                        <Ionicons name="phone-portrait-outline" size={20} color="#333" />
                        <TextInput
                          style={[styles.input, isRTL && { textAlign: "right" }]}
                          placeholder={t("signup.Phone")}
                          onChangeText={handleChange("Phone")}
                          onBlur={handleBlur("Phone")}
                          value={values.Phone}
                          keyboardType="phone-pad"
                        />
                      </View>
                      {touched.Phone && errors.Phone && (
                        <Text style={styles.errorText}>{errors.Phone}</Text>
                      )}

                      {/* زر التسجيل */}
                      <TouchableOpacity
                        style={[styles.signupButton, loading && styles.disabledButton]}
                        onPress={() => handleSubmit()}
                        disabled={isSubmitting || loading}
                      >
                        <Text style={styles.signupButtonText}>
                          {loading ? t("signup.registering") : t("signup.signup_button")}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {/* رابط تسجيل الدخول */}
                  <TouchableOpacity onPress={() => router.replace("/signin")}>
                    <Text style={styles.loginText}>
                      {t("signup.already_have_account")}
                      <Text style={styles.loginLink}> {t("signup.login")}</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
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
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 30,
    ...Shadows.large,
    backdropFilter: "blur(10px)",
  },
  blurContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  accountTypeContainer: {
    marginBottom: 20,
  },
  accountTypeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  accountTypeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  accountTypeButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeButton: {
    backgroundColor: "#36C7F6",
    borderColor: "#36C7F6",
  },
  accountTypeButtonText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  activeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  userTypeContainer: {
    marginBottom: 20,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  userTypeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userTypeButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  userTypeButtonText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 10,
    height: 51,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 10,
  },
  eyeIconContainer: {
    padding: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginStart: 15,
    textAlign: "left",
  },
  signupButton: {
    backgroundColor: "#36C7F6",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
    marginBottom: 15,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  loginLink: {
    color: "#36C7F6",
    fontWeight: "bold",
    marginLeft: 5,
  },
  imageUploadButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  imageUploadText: {
    color: "#36C7F6",
    fontSize: 16,
    fontWeight: "500",
  },
  companyTypeContainer: {
    marginBottom: 20,
  },
  companyTypeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  companyTypeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  companyTypeButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  companyTypeButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#36C7F6",
    borderRadius: 5,
  },
  progressLabel: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  imageUploadRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageName: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  removeImageButton: {
    marginLeft: 10,
    padding: 5,
  },
  removeIcon: {
    fontSize: 18,
    color: "red",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
});

export default SignupScreen;