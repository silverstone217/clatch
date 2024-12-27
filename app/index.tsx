import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TEXT_SIZE, THEME } from "../constants/styles";
import { Redirect, router } from "expo-router";
import { getData, saveData } from "../utils/functions";

const w1 = require("../assets/images/rolex1.png");
const w2 = require("../assets/images/gshock1.png");
const w3 = require("../assets/images/golden-woman.png");
const w4 = require("../assets/images/apple1.png");

const WATCHES = [w1, w2, w3, w4];

const WelcomeScreen = () => {
  const [notFirstTime, setNotFirstTime] = useState<null | true>(null);

  useEffect(() => {
    const isFirstTime = async () => {
      const value = await getData("firstTime");
      if (value) {
        setNotFirstTime(true);
        return;
      }
    };
    isFirstTime();
  }, []);

  if (notFirstTime) {
    return <Redirect href={"/(tabs)"} />;
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <Text style={styles.text}>Quality - Feeling - Premium</Text>
      <Text style={styles.title}>CLATCH.</Text>
      <Text style={styles.subtitle}>
        Find any kind of quality, comfortable, or premium watches at Clatch. We
        are here to help you.
      </Text>

      {/* slider images */}
      <SliderImages />

      {/* button explore */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.5}
        onPress={() => {
          saveData("firstTime", true);
          router.push("/(tabs)");
        }}
      >
        <Text style={styles.buttonText}>EXPLORE More...</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default WelcomeScreen;

const SliderImages = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % WATCHES.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  if (WATCHES.length < 1) return null;

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* img */}
      <Image
        source={WATCHES[index]}
        alt={`image ${WATCHES[index]}`}
        style={{ width: "55%", height: "55%", resizeMode: "contain" }}
      />
      {/* dots */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 10,
          gap: 5,
          top: 0,
          alignItems: "center",
          justifyContent: "center",

          zIndex: 10,
        }}
      >
        {WATCHES.map((_, i) => (
          <View
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: i === index ? THEME.text : THEME.secondary,
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    gap: 20,
    paddingTop: 80,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: TEXT_SIZE.H5,
    color: THEME.secondary,
    fontFamily: "Montserrat_600SemiBold",
  },
  title: {
    fontSize: TEXT_SIZE.H1,
    color: THEME.text,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 6,
  },
  subtitle: {
    fontSize: TEXT_SIZE.BODY,
    color: THEME.secondary,
    fontFamily: "Montserrat_400Regular_Italic",
    lineHeight: 18,
    fontStyle: "italic",
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: THEME.text,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  buttonText: {
    fontSize: TEXT_SIZE.BODY,
    color: THEME.text,
    fontFamily: "Montserrat_700Bold_Italic",
  },
});
