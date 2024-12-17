import { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import { useIsFocused } from "@react-navigation/native";
import PhotoCard from "@/components/PhotoCard";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";

type PhotoType = {
  id: string;
  uri: string;
};
const Photos = () => {
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [assetsToMove, setAssetsToMove] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [selector, setSelector] = useState(false);

  const storeData = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
      getPhotos();
    }, [])
  );

  useEffect(() => {
    (async () => {
      if (assetsToMove.length > 0) {
        let assets: PhotoType[] =
          assetsToMove.map((id) => {
            const [asset] = photos.filter((photo) => photo.id === id);
            return asset;
          }) || [];

        await storeData("assetsTo", JSON.stringify(assets));
      } else {
        await storeData("assetsTo", JSON.stringify([]));
        setSelector(false);
      }
    })();
  }, [assetsToMove]);
  const getData = async () => {
    try {
      const data = await AsyncStorage.getItem("assetsTo");
      if (data === null || JSON.parse(data).length === 0) {
        setAssetsToMove([]);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    if (assetsToMove.length > 0) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [assetsToMove]);
  const getPhotos = async () => {
    setLoading(true);
    try {
      const directoryPath = RNFS.PicturesDirectoryPath + "/Image Gallery";
      const exists = await RNFS.exists(directoryPath);
      if (exists) {
        const result = await RNFS.readDir(directoryPath);
        const paths = result
          .filter((item) => item.isFile())
          .map((item) => {
            console.log({ item });
            return {
              id: item.name.substring(0, item.name.indexOf(".")),
              uri: "file://" + item.path,
            };
          });
        setPhotos(paths);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const addAssetsToMove = (assetId: string) => {
    const assets = [...assetsToMove];

    const foundAsset = assets.filter((id) => id === assetId);
    if (foundAsset.length > 0) {
      const filteredArr = assets.filter((id) => id !== assetId);
      setAssetsToMove(filteredArr);
    } else {
      setAssetsToMove((prev) => [...prev, assetId]);
    }
  };

  const goToFolders = () => {
    router.push("/(tabs)/folders");
  };
  if (loading)
    return (
      <ActivityIndicator
        color="white"
        style={{ flex: 1, backgroundColor: "black" }}
      />
    );
  return (
    <View style={styles.container}>
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
                  onPress={() => {
                    setOpenMenu(false);

                    goToFolders();
                  }}
                >
                  <Text>Move to folder</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {show && (
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
              padding: 5,
              borderRadius: 50,
            }}
          />
        </Pressable>
      )}

      {photos.length > 0 ? (
        <FlatList
          contentContainerStyle={{ padding: 0 }}
          data={photos}
          numColumns={3}
          columnWrapperStyle={{ gap: 2, marginVertical: 2 }}
          renderItem={({ item }) => {
            return (
              <PhotoCard
                photo={item}
                addAssetsToMove={addAssetsToMove}
                selected={assetsToMove}
                selector={selector}
                setSelector={(bool) => setSelector(bool)}
              />
            );
          }}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <MaterialIcons name="insert-photo" size={140} color="grey" />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              alignItems: "center",
            }}
          >
            Gallery is empty
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1C1C",
    padding: 5,
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
  options: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF5A5F",
    position: "absolute",
    bottom: 10,
    right: 30,
    zIndex: 1,
  },
  folderName: {
    backgroundColor: "blue",
    width: 200,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderRadius: 5,
    borderColor: "#BDBDBD",
    padding: 5,
    width: "100%",
    color: "#BDBDBD",
    borderWidth: 0.8,
  },
  button: {
    backgroundColor: "#0C0910",
    padding: 5,
    paddingHorizontal: 50,
    width: "100%",
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#C7D6D5",
    textAlign: "center",
    textTransform: "uppercase",
  },
});
export default Photos;
