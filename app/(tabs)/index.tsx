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
const Photos = () => {
  const [storagePermission, requestStoragePermission] =
    MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [assetsToMove, setAssetsToMove] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [name, setName] = useState("");

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
  const getPhotos = async () => {
    setLoading(true);
    if (storagePermission?.status !== "granted") {
      await requestStoragePermission();
    } else {
      let a = await MediaLibrary.getAlbumsAsync();
      console.log({ a });
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
      return Alert.alert("error occured");
    } else {
      console.log(assetId);

      setAssetsToMove((prev) => [...prev, assetId]);
    }
  };
  const moveAssets = async () => {
    // let assets: MediaLibrary.Asset[] = [];
    // assetsToMove.map((id) => {
    //   const [asset] = photos.filter((photo) => photo.id === id);
    //   assets.push(asset);
    // });
    // const album = await MediaLibrary.getAlbumAsync(name);
    // if (album == null) {
    //   const image = await MediaLibrary.createAlbumAsync(
    //     name,
    //     asset,
    //     false
    //   );
    // const moved = await MediaLibrary.addAssetsToAlbumAsync(
    //   assets,
    //   album,
    //   false
    // );
  };
  if (loading) return <ActivityIndicator />;
  return (
    <View style={styles.container}>
      {/* <Modal
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
                  onPress={() => setOpenMenu(true)}
                >
                  <Text>Move to folder</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        style={styles.modal}
        animationType="slide"
        transparent={true}
        visible={openForm}
      >
        <TextInput
          style={styles.input}
          placeholder="Enter folder name"
          placeholderTextColor={"#717171"}
          onChangeText={(text) => setName(text)}
        />

        <Pressable style={styles.button} onPress={() => moveAssets()}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </Modal>
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
      </Pressable> */}
      {photos.length > 0 ? (
        <FlatList
          contentContainerStyle={{ padding: 0 }}
          data={photos}
          numColumns={3}
          columnWrapperStyle={{ gap: 2, marginVertical: 2 }}
          renderItem={({ item }) => {
            return <PhotoCard photo={item} addAssetsToMove={addAssetsToMove} />;
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
  modal: {
    flex: 1,
    backgroundColor: "blue",
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
