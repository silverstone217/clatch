import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useMemo, useState } from "react";
import { TEXT_SIZE, THEME } from "../../constants/styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { WATCHES_LIST } from "../../constants/data";
import { router } from "expo-router";
import ModalComponent from "../../components/ModalComponent";
import FilterComponent from "../../components/FilterComponent";

const { width: WIDTH } = Dimensions.get("screen");

const HomeScreen = () => {
  const MY_DATA = useMemo(() => WATCHES_LIST, []);
  const [modalVisible, setModalVisible] = useState(false);

  // filters
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState("");
  const [material, setMaterial] = useState("");
  const [gender, setGender] = useState("");

  const filteredData = useMemo(() => {
    const dataFil = [...MY_DATA];

    const filteredResults = dataFil
      .filter(
        (dt) =>
          dt.name.toLowerCase().includes(searchText.toLowerCase()) ||
          dt.brand.toLowerCase().includes(searchText.toLowerCase()) ||
          dt.description.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((dt) => dt.type.toLowerCase().includes(type.toLowerCase()))
      .filter((dt) =>
        dt.material.toLowerCase().includes(material.toLowerCase())
      )
      .filter((dt) => {
        if (gender === "men") {
          return dt.target === "men" || dt.target === "unisex";
        }
        if (gender === "women") {
          return dt.target === "women" || dt.target === "unisex";
        }
        if (gender === "unisex") return dt.target === "unisex";

        return true; // Retourne vrai pour inclure tous les autres cas
      });

    // console.log(MY_DATA.length, "My data", filteredResults.length);

    return filteredResults; // Retournez le tableau filtré
  }, [searchText, type, material, gender, MY_DATA]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.background }}>
      {/* array list items */}
      <ModalComponent
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Filtrer les montres"
      >
        <FilterComponent
          searchText={searchText}
          setSearchText={setSearchText}
          type={type}
          setType={setType}
          material={material}
          setMaterial={setMaterial}
          gender={gender}
          setGender={setGender}
          setModalVisible={setModalVisible}
          // setIsDataChanged={setIsDataChanged}
        />
      </ModalComponent>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            activeOpacity={0.5}
            onPress={() => router.navigate(`/watch/${item.id}`)}
          >
            <Image
              source={item.image}
              style={{ width: "100%", resizeMode: "contain", flex: 1 }}
            />
            <View
              style={{
                height: 80,
                justifyContent: "center",
                gap: 5,
              }}
            >
              <Text
                style={{
                  fontSize: TEXT_SIZE.BODY,
                  color: THEME.text,
                  fontFamily: "Montserrat_700Bold",
                }}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <Text style={{ fontSize: TEXT_SIZE.SMALL, color: THEME.text }}>
                {item.brand}
              </Text>

              {/* price  */}
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontSize: TEXT_SIZE.SUBTITLE,
                    color: item.promotionPrice ? THEME.accentText : THEME.text,
                    fontFamily: "Montserrat_600SemiBold",
                    textDecorationLine: item.promotionPrice
                      ? "line-through"
                      : "none",
                    flex: 1,
                  }}
                >
                  {item.price} $
                </Text>

                {item.promotionPrice && (
                  <Text
                    style={{
                      fontSize: TEXT_SIZE.SUBTITLE,
                      color: THEME.text,
                      fontFamily: "Montserrat_600SemiBold",
                      flex: 1,
                    }}
                  >
                    {item.promotionPrice} $
                  </Text>
                )}
              </View>
            </View>

            {/* Add to cart button */}
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        contentInset={{ top: 20 }}
        scrollEnabled={true}
        numColumns={2}
        maxToRenderPerBatch={4}
        columnWrapperStyle={{
          justifyContent: "space-between",
          gap: 20,
          flex: 1,
        }}
        style={{ backgroundColor: THEME.background }}
        contentContainerStyle={styles.container}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Découvrez nos montres</Text>

            {/* Button open filter */}
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.filterContainer}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.filterText}>Filtres</Text>

              {(gender || searchText || type || material) && (
                <Pressable
                  style={{}}
                  onPress={() => {
                    setSearchText("");
                    setType("");
                    setMaterial("");
                    setGender("");
                  }}
                >
                  <FontAwesome name="close" color={THEME.accent} size={20} />
                </Pressable>
              )}

              <FontAwesome name="filter" size={20} color={THEME.text} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: TEXT_SIZE.BODY }}>
              Aucun produit disponible
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.background,
    gap: 30,
    paddingTop: Platform.OS === "ios" ? 0 : 20,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: TEXT_SIZE.H2,
    color: THEME.text,
    fontFamily: "Montserrat_700Bold",
    marginTop: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
  },
  filterText: {
    fontSize: TEXT_SIZE.P,
    color: THEME.secondary,
    fontFamily: "Montserrat_400Regular",
  },
  itemContainer: {
    flex: 1,
    padding: 10,
    height: 260, // Hauteur de chaque élément
    backgroundColor: THEME.accent,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 20,
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: THEME.background,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.background,
    padding: 20,
  },
  filterItem: {
    padding: 10,
    backgroundColor: THEME.background,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  filterLabel: {
    fontSize: TEXT_SIZE.P,
    color: THEME.text,
    fontFamily: "Montserrat_400Regular",
  },
});
