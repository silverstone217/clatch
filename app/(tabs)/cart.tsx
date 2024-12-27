import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { TEXT_SIZE, THEME } from "../../constants/styles";
import { CartDataType } from "../../types/watch";
import { getData, saveData } from "../../utils/functions";
import { WATCHES_LIST } from "../../constants/data";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useCartStore } from "../../lib/store";

const CartScreen = () => {
  const { myCartsData, setMyCartsData } = useCartStore();
  const [loading, setLoading] = useState(false);

  // get all the charts product data
  useEffect(() => {
    setLoading(true);
    const getCartsData = async () => {
      const value = await getData("myCartsData");
      if (value) {
        setMyCartsData(value);
      } else setMyCartsData([]);
    };
    getCartsData();
    setLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={myCartsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <CartItem
              item={item}
              setMyCartsData={setMyCartsData}
              myCartsData={myCartsData}
            />
          );
        }}
        ListHeaderComponent={
          <Text style={[styles.title, { paddingHorizontal: 20 }]}>Panier</Text>
        }
        ListFooterComponent={
          <View>
            <View style={styles.totalContainer}>
              <Text style={[styles.totalText, { paddingHorizontal: 20 }]}>
                Total
              </Text>
              <Text style={styles.totalPrice}>
                {Number(
                  myCartsData.reduce((acc, curr) => {
                    const wt = WATCHES_LIST.find((x) => x.id === curr.watchId);
                    // Vérifiez si wt est défini avant d'accéder à ses propriétés
                    const price = wt ? wt.promotionPrice ?? wt.price : 0; // Utilise promotionPrice si disponible, sinon price
                    return acc + price * curr.quantity;
                  }, 0)
                ).toFixed(2)}{" "}
                $
              </Text>
            </View>
            <Pressable
              style={styles.checkoutButton}
              onPress={() => console.log("Checkout")}
            >
              <Text style={styles.checkoutText}>Commander</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: TEXT_SIZE.BODY, color: THEME.text }}>
              Votre panier est vide
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default CartScreen;

const CartItem = ({
  item,
  myCartsData,
  setMyCartsData,
}: {
  item: CartDataType;
  myCartsData: CartDataType[];
  setMyCartsData: (carts: CartDataType[]) => void;
}) => {
  const wt = WATCHES_LIST.find((x) => x.id === item.watchId);
  const totalPrice = useMemo(
    () =>
      wt?.promotionPrice
        ? Number(wt.promotionPrice * item.quantity).toFixed(2)
        : wt?.price
        ? Number(wt?.price * item.quantity).toFixed(2)
        : 0,
    [wt, item]
  );

  // remove from cart
  const handleRemoveFromCart = async () => {
    const updatedCarts = myCartsData.filter((cart) => cart.id !== item.id);
    setMyCartsData(updatedCarts);
    await saveData("myCartsData", updatedCarts);
  };

  // increase quantity or decrease quantity
  const handleQuantityChange = async (action: "increase" | "decrease") => {
    if (!item || !wt) return;

    const MAX_LIMIT = wt.stock;
    const MIN_LIMIT = 0;

    const myWatchCart = { ...item }; // Clonage pour éviter les mutations directes

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
      myCartsData.map((cart) => (cart.id === item.id ? myWatchCart : cart))
    );

    // Sauvegarder les données mises à jour
    await saveData("myCartsData", [
      ...myCartsData.filter((cart) => cart.id !== item.id),
      myWatchCart,
    ]);
  };

  return (
    <View style={styles.itemContainer}>
      {/* image */}
      <Image
        source={wt?.image}
        style={{
          width: 80,
          height: 80,
          resizeMode: "contain",
        }}
      />
      {/* infos */}
      <View style={styles.infoItem}>
        <Text style={styles.itemName}>{wt?.name}</Text>
        <Text style={(styles.itemPrice, { color: THEME.accent })}>
          {totalPrice} $
        </Text>
      </View>

      {/* quantity && remove btn */}
      <View style={{ gap: 10 }}>
        <Pressable onPress={() => handleRemoveFromCart()}>
          <Text style={{ color: THEME.accent }}>Supprimer</Text>
        </Pressable>

        {/* change quantity */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable onPress={() => handleQuantityChange("decrease")}>
            <FontAwesome size={22} name="minus" color={THEME.text} />
          </Pressable>
          <Text style={{ fontSize: TEXT_SIZE.SUBTITLE, color: THEME.text }}>
            {item.quantity}
          </Text>
          <Pressable onPress={() => handleQuantityChange("increase")}>
            <FontAwesome size={22} name="plus" color={THEME.text} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    gap: 20,
    paddingBottom: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: TEXT_SIZE.H3,
    color: THEME.text,
    fontFamily: "Montserrat_600SemiBold",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: THEME.secondary,
    gap: 10,
  },
  infoItem: {
    flex: 1,
    width: "70%",
    gap: 5,
  },
  itemName: {
    fontSize: TEXT_SIZE.BODY,
    color: THEME.text,
    fontFamily: "Montserrat_600SemiBold",
  },
  itemPrice: {
    fontSize: TEXT_SIZE.BODY,
    color: THEME.text,
    fontFamily: "Montserrat_500Medium",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 25,
    borderTopWidth: 1,
    borderTopColor: THEME.secondary,
    gap: 10,
  },
  totalText: {
    fontSize: TEXT_SIZE.SUBTITLE,
    color: THEME.text,
    fontFamily: "Montserrat_600SemiBold",
  },
  totalPrice: {
    fontSize: TEXT_SIZE.BODY,
    color: THEME.accent,
    fontFamily: "Montserrat_500Medium",
    paddingHorizontal: 20,
  },
  checkoutButton: {
    backgroundColor: THEME.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  checkoutText: {
    fontSize: TEXT_SIZE.BODY,
    color: THEME.text,
    fontFamily: "Montserrat_600SemiBold",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingVertical: 80,
  },
  separator: {
    height: 1,
    backgroundColor: THEME.secondary,
  },
});
