import React from "react";
import { Href, router } from "expo-router";
import { Pressable } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type Props = {
  openModal: (b: boolean) => void;
};
const FAB: React.FC<Props> = ({ openModal }) => {
  return (
    <Pressable
      onPress={() => openModal(true)}
      style={{
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF5A5F",
        position: "absolute",
        bottom: 30,
        right: 30,
      }}
    >
      <FontAwesome6 name="add" size={24} color="black" />
    </Pressable>
  );
};
export default FAB;
