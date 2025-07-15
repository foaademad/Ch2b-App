import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";
import Animated, { FadeInDown, FadeInRight, FadeOutRight } from "react-native-reanimated";
import { useLanguage } from "../src/context/LanguageContext";
import LanguageToggle from "../src/language/LanguageToggle";

type Props = {};
const WelcomeScreen = (props: Props) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isRTL, setIsRTL] = useState(language === "ar");
  const router = useRouter(); // استخدام useRouter

  // تحديث isRTL عند تغيير اللغة
  useEffect(() => {
    setIsRTL(language === "ar");
  }, [language]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require("../assets/images/ecommerce-splash.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <LanguageToggle />

        <View style={[styles.container, isRTL && { direction: "rtl" }]}>
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255, 255, 255, 0.9)",
              "rgba(255, 255, 255, 1)",
            ]}
            style={styles.gradient}
          >
            <View style={styles.wrapper}>
              <Animated.Text
                style={[styles.text, isRTL && { textAlign: "right" }]}
                entering={FadeInRight.delay(400).duration(300)}
                exiting={FadeOutRight.delay(500).duration(300)}
              >
                <Text>{t("welcome.part1")}</Text>
                <Text style={styles.highlightedNumber}>{t("welcome.highlight")}</Text>
                <Text>{t("welcome.part2")}</Text>
              </Animated.Text>
              <Animated.Text
                style={[styles.description, isRTL && { textAlign: "right" }]}
                entering={FadeInRight.delay(500).duration(300)}
                exiting={FadeOutRight.delay(600).duration(300)}
              >
                {t("description")}
              </Animated.Text>
              <View style={styles.socialLoginWrapper}>
                <Animated.View
                  style={styles.link}
                  entering={FadeInDown.delay(600).duration(300)}
                  exiting={FadeInDown.delay(700).duration(300)}
                >
                  <TouchableOpacity
                    onPress={() => router.replace("/signup")}
                  >
                    <View style={[styles.linkContent, isRTL && { flexDirection: "row-reverse" }]}>
                      <Ionicons name="mail-outline" size={18} color="black" />
                      <Text style={styles.linkText}>
                        {t("continue_with_email")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </View>
              <View style={styles.socialLoginWrapper}>
                <Animated.View
                  entering={FadeInDown.delay(700).duration(300)}
                  exiting={FadeInDown.delay(800).duration(300)}
                >
                  <TouchableOpacity style={styles.link}>
                    <View style={[styles.linkContent, isRTL && { flexDirection: "row-reverse" }]}>
                      <Ionicons name="logo-google" size={18} color="red" />
                      <Text style={styles.linkText}>{t("continue_with_gmail")}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </View>
              <View style={styles.socialLoginWrapper}>
                <Animated.View
                  entering={FadeInDown.delay(800).duration(300)}
                  exiting={FadeInDown.delay(900).duration(300)}
                >
                  <TouchableOpacity style={styles.link}>
                    <View style={[styles.linkContent, isRTL && { flexDirection: "row-reverse" }]}>
                      <Ionicons name="logo-facebook" size={18} color="blue" />
                      <Text style={styles.linkText}>{t("continue_with_apple")}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </View>

              <Text style={[styles.loginTxt, isRTL && { textAlign: "right" }]}>
                {t("already_have_account")}
                <TouchableOpacity
                  onPress={() => router.replace("/signin")}
                >
                  <Text style={[styles.linkTextSign, isRTL && { textAlign: "right" }]}>
                    {t("sign_in")}
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </LinearGradient>
        </View>
      </ImageBackground>
    </>
  );
};

export default WelcomeScreen;


const styles = StyleSheet.create<{
  background: ViewStyle;
  container: ViewStyle;
  gradient: ViewStyle;
  wrapper: ViewStyle;
  text: TextStyle;
  description: TextStyle;
  socialLoginWrapper: ViewStyle;
  link: ViewStyle;
  linkContent: ViewStyle;
  linkText: TextStyle;
  loginTxt: TextStyle;
  linkTextSign: TextStyle;
  highlightedNumber: TextStyle;
}>({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  },
  gradient: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",

  },
  wrapper: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    letterSpacing: 2.4,
    color: "#333",
  },
  description: {
    paddingHorizontal: 30,
    fontSize: 14,
    color: "rgb(136, 136, 136)",
    textAlign: "center",
    marginBottom: 20,
  },
  socialLoginWrapper: {
    alignSelf: "stretch",
    marginBottom: 4,
  },
  link: {
    marginVertical: 2,
    padding: 10,
    borderColor: "rgb(189, 188, 188)",
    borderRadius: 25,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 10,
  },
  linkContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 20,
  },
  linkText: {
    marginLeft: 8,
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  loginTxt: {
    marginTop: 30,
    fontSize: 14,
    paddingBottom: 10,
    color: "rgb(136, 136, 136)",
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  linkTextSign: {
    marginHorizontal: 8,
    color: "rgb(54, 199, 246)",
    fontSize: 15,
    fontWeight: "bold",
    textTransform: "capitalize",

  },
  highlightedNumber: {
    color: "rgb(54, 199, 246)",
    fontWeight: "bold",
  },
});