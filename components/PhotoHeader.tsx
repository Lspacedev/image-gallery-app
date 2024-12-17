import { useState } from "react";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import {
  View,
  Pressable,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import RNFS from "react-native-fs";

type Props = {
  folder: any;
  assetId: any;
  albumId: any;
};
const PhotoHeader: React.FC<Props> = ({ folder, assetId, albumId }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const goToBack = () => {
    router.back();
  };
  const deletePhoto = async () => {
    if (typeof folder === "undefined") {
      const directoryPath =
        RNFS.PicturesDirectoryPath + "/Image Gallery/" + assetId + ".jpg";
      RNFS.unlink(directoryPath)
        .then(() => {
          console.log("deleted");
          RNFS.scanFile(directoryPath)
            .then(() => {
              console.log("scanned");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const directoryPath =
        RNFS.PicturesDirectoryPath +
        "/Image Gallery/" +
        folder +
        "/" +
        assetId +
        ".jpg";
      RNFS.unlink(directoryPath)
        .then(() => {
          console.log("deleted");
          RNFS.scanFile(directoryPath)
            .then(() => {
              console.log("scanned");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
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

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => deletePhoto()}
                >
                  <MaterialIcons name="delete" size={24} />
                  <Text>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setOpenMenu(false);
                    router.push({
                      pathname: "/[id]/details",
                      params: { id: assetId },
                    });
                  }}
                  style={styles.menuItem}
                >
                  <FontAwesome name="file-text-o" size={24} />
                  <Text> Details</Text>
                </TouchableOpacity>
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
      <TouchableOpacity
        style={styles.options}
        onPressIn={() => {
          console.log({ openMenu });
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
      </TouchableOpacity>
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
    height: 130,
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
    gap: 5,
    alignItems: "center",
    paddingVertical: 10,
  },
  options: {
    zIndex: 1,
  },
});
export default PhotoHeader;
