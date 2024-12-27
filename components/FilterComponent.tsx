import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { TEXT_SIZE, THEME } from "../constants/styles";
import { Gender_DATA, Material_DATA, TYPE_DATA } from "../utils/data";

type Props = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  material: string;
  setMaterial: React.Dispatch<React.SetStateAction<string>>;
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  //   filteredData: () => void;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  //   setIsDataChanged: React.Dispatch<React.SetStateAction<boolean>>;
};

const FilterComponent = ({
  searchText,
  setSearchText,
  type,
  setType,
  material,
  setMaterial,
  gender,
  setGender,
  //   filteredData,
  setModalVisible,
}: //   setIsDataChanged,
Props) => {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <Text>FilterComponent</Text>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Rechercher..."
          placeholderTextColor={THEME.accentText}
          clearButtonMode="always"
        />
      </View>

      {/* type */}
      <View style={styles.subContainer}>
        <Text style={styles.subText}>Type</Text>
        <View style={styles.buttonGroup}>
          {TYPE_DATA.map((dt, i) => (
            <TouchableOpacity
              key={i}
              style={type === dt.value ? styles.buttonActive : styles.button}
              onPress={() => setType(dt.value)}
            >
              <Text style={styles.buttonText}>{dt.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={type === "" ? styles.buttonActive : styles.button}
            onPress={() => setType("")}
          >
            <Text style={styles.buttonText}>{"Toutes"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* material */}
      <View style={styles.subContainer}>
        <Text style={styles.subText}>Matière</Text>
        <View style={styles.buttonGroup}>
          {Material_DATA.map((dt, i) => (
            <TouchableOpacity
              key={i}
              style={
                material === dt.value ? styles.buttonActive : styles.button
              }
              onPress={() => setMaterial(dt.value)}
            >
              <Text style={styles.buttonText}>{dt.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={material === "" ? styles.buttonActive : styles.button}
            onPress={() => setMaterial("")}
          >
            <Text style={styles.buttonText}>{"Toutes"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* gender */}
      <View style={styles.subContainer}>
        <Text style={styles.subText}>Genre</Text>
        <View style={styles.buttonGroup}>
          {Gender_DATA.map((dt, i) => (
            <TouchableOpacity
              key={i}
              style={gender === dt.value ? styles.buttonActive : styles.button}
              onPress={() => setGender(dt.value)}
            >
              <Text style={styles.buttonText}>{dt.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={gender === "" ? styles.buttonActive : styles.button}
            onPress={() => setGender("")}
          >
            <Text style={styles.buttonText}>{"Toutes"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Button apply */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: THEME.accent,
            marginTop: 30,
            width: "100%",
            alignSelf: "center",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        activeOpacity={0.5}
        onPress={() => {
          //   filteredData();
          //   setIsDataChanged(true);
          setModalVisible(false);
        }}
      >
        <Text style={styles.buttonText}>Appliquer</Text>
      </TouchableOpacity>

      {/* Button reset */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: THEME.secondary,
            width: "100%",
            alignSelf: "center",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        activeOpacity={0.5}
        onPress={() => {
          setSearchText("");
          setType("");
          setMaterial("");
          setGender("");
        }}
      >
        <Text style={styles.buttonText}>Réinitialiser</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FilterComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  searchContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width: "100%",
  },
  searchInput: {
    padding: 10,
    fontSize: 18,
  },
  subContainer: {
    width: "100%",
    gap: 10,
  },
  subText: {
    fontSize: TEXT_SIZE.P,
    fontFamily: "Montserrat_500Medium",
    color: THEME.text,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: 10,
  },
  button: {
    padding: 10,
    backgroundColor: THEME.secondary,
    borderRadius: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: TEXT_SIZE.BODY,
    color: THEME.text,
  },
  buttonActive: {
    backgroundColor: THEME.accent,
    borderRadius: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 10,
  },
  filterLabel: {
    fontSize: TEXT_SIZE.P,
    color: THEME.text,
    fontFamily: "Montserrat_400Regular",
  },
});
