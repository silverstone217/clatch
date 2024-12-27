import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { TEXT_SIZE, THEME } from "../constants/styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Redirect, router } from "expo-router";
import { getData, saveData } from "../utils/functions";
import { useCartStore } from "../lib/store";

const SignScreen = () => {
  const { user, setUser } = useCartStore();

  const [isSigningUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleToggleSignUp = () => {
    setIsSignUp(!isSigningUp);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (email.replace(/ /g, "") === "" || password.replace(/ /g, "") === "") {
        alert("Veuillez remplir tous les champs.");
        setLoading(false);
        return;
      }

      const formData = isSigningUp
        ? {
            email: email.trim(),
            name: name.toLowerCase().trim(),
            password: password.trim(),
          }
        : { email: email.trim(), password: password.trim() };

      const getUser = (await getData("user")) as {
        email: string;
        name: string;
        password: string;
      };

      if (isSigningUp) {
        if (name.replace(/ /g, "") === "") {
          alert("Veuillez entrer un nom.");
          setLoading(false);
          return;
        }

        await saveData("user", formData);
        setTimeout(() => router.navigate("/(tabs)"), 3000);
        setTimeout(
          () =>
            setUser({
              email: email.trim(),
              name: name.toLowerCase().trim(),
              password: password.trim(),
            }),
          3000
        );
        return;
      } else {
        if (!getUser || getUser.email !== formData.email) {
          alert("Aucun utilisateur n'a été trouvé avec cet email.");
          return;
        }

        if (getUser.password !== formData.password) {
          alert("Mot de passe incorrect.");
          return;
        }
        setTimeout(() => router.navigate("/(tabs)"), 3000);
        setTimeout(() => setUser(getUser), 3000);
        return;
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur s'est produite lors de l'enregistrement.");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={styles.container}>
      {/* Welcome Text */}
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={styles.welcomeText}>Bienvenue</Text>
        <Text
          style={{
            fontSize: TEXT_SIZE.BODY,
            marginTop: 5,
            color: THEME.text,
            fontFamily: "Montserrat_300Light_Italic",
            textAlign: "center",
          }}
        >
          sur
        </Text>
        <Text style={styles.welcomeText}>Clatch.</Text>
      </View>

      {/* Sign-up/Sign-in Screen */}
      {isSigningUp ? (
        <Text style={styles.title}>Creer un nouveau compte</Text>
      ) : (
        <Text style={styles.title}>Connectez-vous à votre compte</Text>
      )}

      {/* form */}
      <View style={styles.form}>
        {/* Name */}
        {isSigningUp ? (
          <View style={styles.inputContainer}>
            <FontAwesome name="user-o" size={24} color={THEME.text} />
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Nom et Prenom"
              placeholderTextColor={THEME.secondary}
              autoComplete="name"
              autoCapitalize="none"
              autoCorrect={false}
              aria-label="name"
            />
          </View>
        ) : null}

        {/* Email */}
        <View style={styles.inputContainer}>
          <FontAwesome name="envelope-o" size={24} color={THEME.text} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={THEME.secondary}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            aria-label="email"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={24} color={THEME.text} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={isVisible}
            style={styles.input}
            placeholder="Mot de Passe"
            placeholderTextColor={THEME.secondary}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setIsVisible((pre) => !pre)}>
            {!isVisible ? (
              <FontAwesome name="eye" size={24} color={THEME.text} />
            ) : (
              <FontAwesome name="eye-slash" size={24} color={THEME.text} />
            )}
          </Pressable>
        </View>

        {/* Sign-up/Sign-in Button */}
        <TouchableOpacity
          disabled={loading}
          style={styles.SignButton}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "En cours..."
              : isSigningUp
              ? "Créer un compte"
              : "Connexion"}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: THEME.text }}>
            {isSigningUp ? "Déjà un compte?" : "Pas encore de compte?"}
          </Text>
          <TouchableOpacity onPress={handleToggleSignUp} disabled={loading}>
            <Text style={{ color: THEME.accent }}>
              {isSigningUp ? "Se connecter" : "Créer un compte"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* forgot password on sign in only */}
        {!isSigningUp && (
          <Link href={"#"}>
            <Text
              style={{
                color: THEME.secondary,
                textDecorationLine: "underline",
              }}
            >
              Mot de passe oublié?
            </Text>
          </Link>
        )}
        {/* social media login */}
      </View>
    </View>
  );
};

export default SignScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    gap: 20,
    padding: 20,
    paddingTop: 45,
  },
  welcomeText: {
    fontSize: TEXT_SIZE.H3,
    fontFamily: "Montserrat_900Black_Italic",
    color: THEME.text,
    textTransform: "uppercase",
    letterSpacing: 3,
    textAlign: "center",
  },
  title: {
    fontSize: TEXT_SIZE.H5,
    color: THEME.text,
    fontFamily: "Montserrat_600SemiBold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  form: {
    gap: 20,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.secondary,
    borderRadius: 15,
    paddingHorizontal: 10,
    height: 55,
  },
  input: {
    flex: 1,
    fontSize: TEXT_SIZE.P,
    marginLeft: 10,
    color: THEME.text,
    fontFamily: "Montserrat_400Regular",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  SignButton: {
    backgroundColor: THEME.accent,
    borderRadius: 15,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: TEXT_SIZE.BODY,
    color: THEME.text,
    fontFamily: "Montserrat_600SemiBold",
    textTransform: "uppercase",
    textAlign: "center",
  },
});
