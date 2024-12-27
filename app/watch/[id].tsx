import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Link, Redirect, router, useLocalSearchParams } from "expo-router";
import { TEXT_SIZE, THEME } from "../../constants/styles";
import { WATCHES_LIST } from "../../constants/data";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CartDataType } from "../../types/watch";
import { generateRandomString, getData, saveData } from "../../utils/functions";
import { useCartStore } from "../../lib/store";

const { width: WIDTH } = Dimensions.get("screen");
const WatchScreen = () => {
  const { id } = useLocalSearchParams();
  const WATCH = WATCHES_LIST.find((watch) => watch.id.toString() === id);
  const { myCartsData, setMyCartsData } = useCartStore();

  // check if the watch is on carts
  const isWatchOnCarts = useMemo(
    () =>
      WATCH && myCartsData.length > 0
        ? myCartsData.find((w) => w.watchId === WATCH.id)
        : null,
    [WATCH, myCartsData]
  );

  // get all the charts product data
  useEffect(() => {
    const getCartsData = async () => {
      const value = await getData("myCartsData");
      if (value) {
        setMyCartsData(value);
      } else setMyCartsData([]);
    };
    getCartsData();
  }, []);

  // add to cart
  const addToCart = async () => {
    if (!WATCH || isWatchOnCarts) return;
    const randomString = generateRandomString();

    const watch: CartDataType = {
      id: randomString,
      watchId: WATCH.id,
      quantity: 1,
      price: WATCH.promotionPrice ? WATCH.promotionPrice : WATCH.price,
      createdAt: Date.now(),
    };
    setMyCartsData([...myCartsData, watch]);
    await saveData("myCartsData", myCartsData);
  };

  // remove from cart
  const handleRemoveFromCart = async () => {
    if (!isWatchOnCarts) return;

    const updatedCarts = myCartsData.filter(
      (cart) => cart.id !== isWatchOnCarts.id
    );
    setMyCartsData(updatedCarts);
    await saveData("myCartsData", updatedCarts);
  };

  // increase quantity or decrease quantity
  const handleQuantityChange = async (action: "increase" | "decrease") => {
    if (!isWatchOnCarts || !WATCH) return;

    const MAX_LIMIT = WATCH.stock;
    const MIN_LIMIT = 0;

    const myWatchCart = { ...isWatchOnCarts }; // Clonage pour éviter les mutations directes

    if (action === "increase" && myWatchCart.quantity < MAX_LIMIT) {
      myWatchCart.quantity++;
    } else if (action === "decrease") {
      if (myWatchCart.quantity > MIN_LIMIT) {
        myWatchCart.quantity--;
      }
      // Si la quantité atteint 0 après la diminution
      if (myWatchCart.quantity <= 0) {
        handleRemoveFromCart(); // Appel pour retirer l'article du panier
        return; // Sortir de la fonction après avoir retiré l'article
      }
    }

    // Mettre à jour le tableau des données du panier
    setMyCartsData(
      myCartsData.map((cart) =>
        cart.id === isWatchOnCarts.id ? myWatchCart : cart
      )
    );

    // Sauvegarder les données mises à jour
    await saveData("myCartsData", [
      ...myCartsData.map((cart) =>
        cart.id === isWatchOnCarts.id ? myWatchCart : cart
      ),
    ]);
  };

  if (!id) return <Redirect href={"/(tabs)"} />;

  if (!WATCH) {
    return (
      <View
        style={[
          styles.container,
          {
            alignItems: "center",
            justifyContent: "center",
            width: WIDTH,
            padding: 20,
          },
        ]}
      >
        <Text style={styles.title}>Aucun produit trouvé</Text>
        <Link style={styles.link} href="/(tabs)">
          <Text style={styles.linkText}>{`Retour au menu d'accueil`}</Text>
        </Link>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: THEME.background }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: THEME.background }}
        contentContainerStyle={styles.container}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={WATCH.image}
            style={{ width: "70%", resizeMode: "contain", height: "70%" }}
          />

          {/* back button */}
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={28} color={THEME.text} />
          </TouchableOpacity>
        </View>

        {/* infos */}
        <View style={styles.infosContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {WATCH.name}
          </Text>

          <View style={styles.subTitleGroup}>
            <Text style={[styles.subtitle, { textTransform: "capitalize" }]}>
              {WATCH.brand}
            </Text>
            <Text style={[styles.subtitle, { textTransform: "capitalize" }]}>
              {WATCH.type}
            </Text>
            <Text style={[styles.subtitle, { textTransform: "capitalize" }]}>
              {WATCH.material}
            </Text>
            <Text style={[styles.subtitle, { textTransform: "capitalize" }]}>
              {WATCH.color}
            </Text>
            <Text style={[styles.subtitle, { textTransform: "capitalize" }]}>
              {WATCH.target}
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{WATCH.price} $</Text>
            {WATCH.promotionPrice && (
              <Text style={styles.promotionPrice}>
                {WATCH.promotionPrice} $ (
                {
                  -Math.round(
                    ((WATCH.price - WATCH.promotionPrice) / WATCH.price) * 100
                  )
                }
                %)
              </Text>
            )}
          </View>

          {/* Description */}
          <Text numberOfLines={2} style={styles.description}>
            {WATCH.description}
          </Text>

          {/* Add to cart button */}
          {!isWatchOnCarts ? (
            <TouchableOpacity
              style={styles.addToCartButton}
              activeOpacity={0.5}
              onPress={() => addToCart()}
            >
              <Text style={styles.addToCartText}>Ajouter au panier</Text>
              <FontAwesome size={28} name="shopping-cart" color={THEME.text} />
            </TouchableOpacity>
          ) : (
            <View style={[styles.addToCartButton, { gap: 20 }]}>
              <Pressable onPress={() => handleQuantityChange("decrease")}>
                <FontAwesome size={28} name="minus" color={THEME.text} />
              </Pressable>
              <Text style={[styles.addToCartText, { fontSize: TEXT_SIZE.H5 }]}>
                {isWatchOnCarts.quantity}
              </Text>
              <Pressable onPress={() => handleQuantityChange("increase")}>
                <FontAwesome size={28} name="plus" color={THEME.text} />
              </Pressable>
              <TouchableOpacity
                style={{
                  backgroundColor: THEME.accent,
                  position: "absolute",
                  right: 10,
                }}
                activeOpacity={0.5}
                onPress={() => handleRemoveFromCart()}
              >
                <FontAwesome name="trash" size={28} color={"crimson"} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default WatchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    gap: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: TEXT_SIZE.H3,
    color: THEME.text,
    fontFamily: "Montserrat_600SemiBold",
  },
  link: {},
  linkText: {
    fontSize: TEXT_SIZE.P,
    color: THEME.accentText,
    fontFamily: "Montserrat_600SemiBold",
    textDecorationLine: "underline",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: THEME.accent,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  infosContainer: {
    paddingHorizontal: 20,
  },
  subTitleGroup: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    marginTop: 10,
    marginBottom: 5,
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: TEXT_SIZE.BODY,
    color: THEME.secondary,

    fontFamily: "Montserrat_500Medium",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  price: {
    fontSize: TEXT_SIZE.H5,
    color: THEME.text,
    fontFamily: "Montserrat_700Bold",
  },
  promotionPrice: {
    fontSize: TEXT_SIZE.H5,
    color: THEME.text,
    fontFamily: "Montserrat_700Bold",
    textDecorationLine: "line-through",
  },
  addToCartButton: {
    backgroundColor: THEME.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    position: "relative",
  },
  addToCartText: {
    fontSize: TEXT_SIZE.SUBTITLE,
    color: THEME.text,
    fontFamily: "Montserrat_700Bold",
  },
  description: {
    fontSize: TEXT_SIZE.BODY,
    color: THEME.secondary,
    marginTop: 10,
    marginBottom: 20,
    fontFamily: "Montserrat_400Regular",
  },
});
