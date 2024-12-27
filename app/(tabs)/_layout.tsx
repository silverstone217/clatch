import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { THEME } from "../../constants/styles";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME.text,
        tabBarStyle: {
          backgroundColor: THEME.background,
          borderColor: THEME.secondary,
          borderWidth: 0.5,
          elevation: 0,
          position: "absolute",
          left: 30,
          right: 30,
          bottom: 27,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 30,
          height: 65,
          paddingTop: 5,
          borderRadius: 20,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Panier",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="shopping-cart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user-circle" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="watch/[id]"
        options={{
          title: "Watch",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="clock-o" color={color} />
          ),
          href: null,
        }}
      /> */}
    </Tabs>
  );
};

export default TabLayout;
