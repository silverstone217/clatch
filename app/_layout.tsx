import React, { useEffect } from "react";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light_Italic,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black_Italic,
} from "@expo-google-fonts/montserrat";
import { View } from "react-native";
import { THEME } from "../constants/styles";
import { useCartStore } from "../lib/store";
import { getData } from "../utils/functions";

SplashScreen.preventAutoHideAsync();

const MainLayout = () => {
  let [loaded, error] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    Montserrat_100Thin_Italic,
    Montserrat_200ExtraLight_Italic,
    Montserrat_300Light_Italic,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black_Italic,
  });

  const { user, setUser } = useCartStore();

  useEffect(() => {
    if (loaded || error) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 5000);
    }
  }, [loaded, error]);

  useEffect(() => {
    const getUserInfo = async () => {
      const value = await getData("user");
      setUser(value);
    };
    getUserInfo();
  }, []);

  if (!loaded && !error) {
    return null;
  }
  console.log(user);

  return (
    <View
      style={{
        backgroundColor: THEME.background,
        flex: 1,
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar style="light" />
    </View>
  );
};

export default MainLayout;
