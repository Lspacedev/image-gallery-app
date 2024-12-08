import { useState, useEffect } from "react";
import React from "react";

import Feather from "@expo/vector-icons/Feather";

import {
  View,
  Pressable,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Link, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import * as MediaLibrary from "expo-media-library";

type Props = {
  assetId: string;
  albumId: string;
};
const PhotoHeader: React.FC<Props> = ({ assetId, albumId }) => {
  const [openMenu, setOpenMenu] = useState(false);

  const goToBack = () => {
    router.back();
  };
  const deletePhoto = async () => {
    await MediaLibrary.removeAssetsFromAlbumAsync(assetId, albumId);
    setOpenMenu(false);
    router.push("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        style={styles.menuModal}
        animationType="fade"
        transparent={true}
        visible={openMenu}
        onRequestClose={() => {
          setOpenMenu(false);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setOpenMenu(false);
          }}
        >
          <View style={{ backgroundColor: "transparent", flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.menu}>
                <Text
                  onPress={() => {
                    setOpenMenu(false);
                  }}
                  style={{
                    padding: 0,
                    margin: 0,
                    textAlign: "right",
                  }}
                >
                  <EvilIcons name="close" size={24} color="black" />
                </Text>

                <Pressable
                  style={styles.menuItem}
                  onPress={() => deletePhoto()}
                >
                  <MaterialIcons name="delete" size={24} />
                  <Text>Delete</Text>
                </Pressable>
                <Link
                  href={{
                    pathname: "/[id]/details",
                    params: { id: assetId },
                  }}
                >
                  <Text>Details</Text>
                </Link>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Pressable onPress={goToBack}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </Pressable>
      <Link href={{ pathname: "../[id]/map", params: { id: assetId } }}>
        <Feather name="map-pin" size={24} color="white" />
      </Link>
      <Pressable
        style={styles.options}
        onPress={() => {
          setOpenMenu(true);
        }}
      >
        <SimpleLineIcons
          name="options-vertical"
          size={24}
          style={{
            color: "whitesmoke",
            backgroundColor: "black",
            padding: 5,
            borderRadius: 50,
          }}
        />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 15,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
  },
  text: {
    color: "white",
  },
  menuModal: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    right: 0,
    width: 200,
    height: 100,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 15,
    alignItems: "center",
    padding: 5,
  },
  options: {},
});
export default PhotoHeader;
