import {
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import React from "react";
import { TEXT_SIZE, THEME } from "../constants/styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string | undefined;
  children: React.ReactNode;
};

const ModalComponent = ({ visible, onClose, title, children }: Props) => {
  return (
    <Modal visible={visible}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: THEME.background,
          },
        ]}
      >
        {/* title  */}
        {title && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 30,
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: TEXT_SIZE.P,
                color: THEME.text,
                textTransform: "capitalize",
              }}
            >
              {title}
            </Text>

            {/* close button */}
            <Pressable style={styles.buttonClose} onPress={() => onClose()}>
              <FontAwesome name="close" color={THEME.text} size={28} />
            </Pressable>
          </View>
        )}

        {children}
      </View>
    </Modal>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: 20,
    gap: 10,
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 30 : 0,
  },
  buttonClose: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
});
