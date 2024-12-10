import { useState, useEffect } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

import {
  View,
  FlatList,
  Button,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import { useIsFocused } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import PhotoCard from "@/components/PhotoCard";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Photos = () => {
  const [storagePermission, requestStoragePermission] =
    MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [assetsToMove, setAssetsToMove] = useState<MediaLibrary.AssetRef[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [show, setShow] = useState(false);

  const [name, setName] = useState("");
  const storeData = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    (async () => {
      let assets: MediaLibrary.Asset[] =
        assetsToMove.map((id) => {
          const [asset] = photos.filter((photo) => photo.id === id);
          return asset;
        }) || [];

      await storeData("assetsTo", JSON.stringify(assets));
    })();
  }, [assetsToMove]);
  const getData = async () => {
    try {
      const data = await AsyncStorage.getItem("assetsTo");
      console.log("index", { data });
      if (data === null) {
        setAssetsToMove([]);
        //setShow(false);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  // useEffect(() => {
  //   console.log(storagePermission);
  //   (async () => {
  //     if (storagePermission?.status !== "granted") {
  //       await requestStoragePermission();
  //     }
  //   })();
  // }, [storagePermission]);
  // useEffect(() => {
  //   console.log(
  //     "ddd",
  //     storagePermission && storagePermission.status === "granted"
  //   );
  //   getPhotos();
  // }, []);
  useEffect(() => {
    isFocused && getPhotos();
  }, [isFocused, storagePermission]);
  useEffect(() => {
    if (assetsToMove.length > 0) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [assetsToMove]);
  const getPhotos = async () => {
    setLoading(true);
    if (storagePermission?.status !== "granted") {
      await requestStoragePermission();
    } else {
      let a = await MediaLibrary.getAlbumsAsync();
      let album = await MediaLibrary.getAlbumAsync("Image Gallery");
      if (album !== null) {
        const media = await MediaLibrary.getAssetsAsync({
          album: album,
          mediaType: MediaLibrary.MediaType.photo,
          first: 40,
        });
        if (media !== null) {
          const assets = media.assets;
          setPhotos(assets);
          setLoading(false);
        }
      } else {
        setPhotos([]);
        setLoading(false);
      }
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
  if (loading) return <ActivityIndicator />;
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
              backgroundColor: "black",
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
              />
            );
          }}
        />
      ) : (
        <Text
          style={{ textAlign: "center", color: "white", alignItems: "center" }}
        >
          Gallery is empty
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
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
  options: {},
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
