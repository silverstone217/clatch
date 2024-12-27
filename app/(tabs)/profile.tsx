import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { TEXT_SIZE, THEME } from "../../constants/styles";
import { router } from "expo-router";
import { useCartStore } from "../../lib/store";
import { FontAwesome } from "@expo/vector-icons";
// import { removeData } from "../../utils/functions";

const ProfileScreen = () => {
  const { user, setUser } = useCartStore();

  const handleLogout = async () => {
    // await removeData("user");
    setUser(null);
    router.push("/sign");
  };

  return (
    <View style={styles.container}>
      {!user && (
        <View style={{ paddingTop: 50, paddingHorizontal: 20 }}>
          <Text style={styles.noText}>
            Pour Acceder vos infos, connectez-vous
          </Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.push("/sign")}
          >
            <Text style={styles.logoutButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      )}
      {user && (
        <View style={styles.leftView}>
          {/* image */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View style={styles.image}>
              <Image
                source={require("../../assets/icons/user.png")}
                alt="user icon"
                style={{ width: "70%", height: "70%" }}
              />
            </View>
            {/* info */}
            <View>
              <Text style={styles.nameText}>{user.name}</Text>
              <Text style={styles.emailText}>{user.email}</Text>
            </View>
          </View>
        </View>
      )}

      {user && (
        <View style={{ paddingHorizontal: 20, marginTop: 80 }}>
          <TouchableOpacity
            style={[styles.saleButton]}
            onPress={() => router.push("#")}
            activeOpacity={0.5}
          >
            <Text style={styles.logoutButtonText}>Mes achats</Text>
            <FontAwesome name="shopping-bag" color={"white"} size={24} />
          </TouchableOpacity>

          {/* logout */}
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: "crimson" }]}
            onPress={() => handleLogout()}
            activeOpacity={0.5}
          >
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    gap: 20,
    paddingBottom: 20,
  },
  logoutButton: {
    backgroundColor: THEME.accent,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: THEME.text,
    fontSize: 18,
    textAlign: "center",
  },
  noText: {
    color: THEME.text,
    fontSize: 20,
    textAlign: "center",
    marginTop: 40,
    marginBottom: 0,
  },
  leftView: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingTop: 0,
    backgroundColor: THEME.accent,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: THEME.background,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nameText: {
    color: THEME.background,
    fontSize: TEXT_SIZE.H5,
    fontFamily: "Montserrat_600SemiBold",
    textTransform: "capitalize",
  },
  emailText: {
    color: THEME.background,
    fontSize: TEXT_SIZE.SUBTITLE,
  },
  saleButton: {
    backgroundColor: THEME.accent,
    padding: 15,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
