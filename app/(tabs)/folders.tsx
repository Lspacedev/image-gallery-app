import { useState, useEffect } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

import {
  ScrollView,
  Button,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import * as FileSystem from "expo-file-system";
import FileSystem from "expo-file-system";
import RNFS from "react-native-fs";
import FolderCard from "@/components/FolderCard";
import { updateId } from "@/db/SQLiteFunctions";
import { useIsFocused } from "@react-navigation/native";

type Props = {};
type folderType = {
  name: string;
  size: number;
};
const Folders = (props: Props) => {
  //   const [name, setName] = useState<InputType>("");
  const [album, setAlbum] = useState<MediaLibrary.Album>();
  const [folders, setFolders] = useState<folderType[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [name, setName] = useState("");
  const [assetsToMove, setAssetsToMove] = useState<MediaLibrary.Asset[]>([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const isFocused = useIsFocused();
  const [isAssetMove, setIsAssetMove] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isFocused && getData();
    //getAlbum();
    getAlbums();
  }, [isFocused]);
  const getData = async () => {
    try {
      const data = await AsyncStorage.getItem("assetsTo");
      console.log({ data });
      if (data !== null) {
        const arr = JSON.parse(data);
        setAssetsToMove(arr);
        console.log({ arr });
        if (arr.length === 0) {
          console.log("empty");
          setIsAssetMove(false);
          setLoading(false);
        } else {
          console.log("not empty");

          setIsAssetMove(true);
          setLoading(false);
        }
        // return data;
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  const getAlbum = async () => {
    if (permissionResponse?.status !== "granted") {
      await requestPermission();
    }
    const fetchedAlbum = await MediaLibrary.getAlbumAsync("Image Gallery");
    setAlbum(fetchedAlbum);
  };
  const getAlbums = async () => {
    // if (permissionResponse?.status !== "granted") {
    //   await requestPermission();
    // }
    // const fetchedAlbums = await MediaLibrary.getAlbumAsync("Image Gallery");
    // console.log(fetchedAlbums);
    try {
      const directoryPath = RNFS.PicturesDirectoryPath + "/Image Gallery";
      const result = await RNFS.readDir(directoryPath);

      const folderNames = result
        .filter((item) => item.isDirectory())
        .map((item) => {
          return { name: item.name, size: item.size };
        });
      setFolders(folderNames);
    } catch (err) {}
  };

  const moveAssets = async (name: string) => {
    try {
      //check if album
      let selectedAlbum = await MediaLibrary.getAlbumAsync(name);
      console.log({ selectedAlbum });
      if (selectedAlbum === null && assetsToMove.length > 0) {
        const asset = await MediaLibrary.createAssetAsync(assetsToMove[0].uri);
        console.log({ asset });
        const create = await MediaLibrary.createAlbumAsync(name, asset, false);
        console.log({ create });
        const moved = await MediaLibrary.addAssetsToAlbumAsync(
          assetsToMove.slice(1),
          create,
          false
        );
        // console.log({ moved });
        // const media = await MediaLibrary.getAssetsAsync({
        //   album: create,
        //   mediaType: MediaLibrary.MediaType.photo,
        //   first: 40,
        // });
        // if (media !== null) {
        //   const assets = media.assets;
        //   //update assets metadata
        //   assets.map(async (newAsset) => {
        //     assetsToMove.map(async (asset) => {
        //       if (asset.filename === newAsset.filename) {
        //         console.log(asset.filename, newAsset.filename);
        //         await updateId(asset.id, newAsset.id);
        //       }
        //     });
        //   });
        // }

        setOpenForm(false);
        setIsAssetMove(false);
        await AsyncStorage.removeItem("assetsTo");
      }
      if (selectedAlbum && assetsToMove.length > 0) {
        console.log("second");
        const moved = await MediaLibrary.addAssetsToAlbumAsync(
          assetsToMove,
          selectedAlbum,
          false
        );
        const media = await MediaLibrary.getAssetsAsync({
          album: selectedAlbum,
          mediaType: MediaLibrary.MediaType.photo,
          first: 40,
        });
        if (media !== null) {
          const assets = media.assets;
          //update assets metadata
          assets.map((newAsset) => {
            assetsToMove.map(async (asset) => {
              if (asset.filename === newAsset.filename) {
                await updateId(newAsset.id, asset.filename);
              }
            });
          });
        }
        setOpenForm(false);
        setIsAssetMove(false);
        await AsyncStorage.removeItem("assetsTo");
      }
    } catch (err) {
      console.log(err);
    }
    //   // const album = await MediaLibrary.getAlbumAsync(name);
    //   // if (album == null && assets.length > 0) {
    //   //   const asset = await MediaLibrary.createAssetAsync(assets[0].uri);

    //   //   const create = await MediaLibrary.createAlbumAsync(name, asset, false);
    //   //   //move the rest of the images
    //   //   const newAlbum = await MediaLibrary.getAlbumAsync(name);

    //   //   const moved = await MediaLibrary.addAssetsToAlbumAsync(
    //   //     assets.slice(1),
    //   //     newAlbum,
    //   //     false
    //   //   );
    //   //   setOpenForm(false);
    //   // } else {
    //   //   const moved = await MediaLibrary.addAssetsToAlbumAsync(
    //   //     assets,
    //   //     album,
    //   //     false
    //   //   );
    //   //   setOpenForm(false);
    //   // }
  };

  // const moveAssets = async (name: string) => {
  //   console.log({ name });
  //   setIsAssetMove(false);
  //   await AsyncStorage.removeItem("assetsTo");
  // };

  const setFolderName = (text: string) => {
    setName(text);
  };
  console.log("before", { isAssetMove });

  console.log({ loading });
  if (loading) return <ActivityIndicator />;
  console.log("after", { isAssetMove });

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openForm}
        onRequestClose={() => {
          setOpenForm(false);
        }}
        style={styles.menuModal}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setOpenForm(false);
          }}
        >
          <View style={{ backgroundColor: "transparent", flex: 1 }}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.folderName}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter folder name"
                  placeholderTextColor={"#717171"}
                  onChangeText={(text) => setName(text)}
                />

                <Pressable
                  style={styles.button}
                  onPress={() => moveAssets(name)}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Pressable
        onPress={() => {
          setOpenForm(true);
        }}
      >
        <Text>Create</Text>
      </Pressable>
      {folders.length > 0 ? (
        <FlatList
          contentContainerStyle={{ padding: 0 }}
          data={folders}
          numColumns={3}
          columnWrapperStyle={{ gap: 2, marginVertical: 2 }}
          renderItem={({ item }) => {
            return (
              <FolderCard
                folder={item}
                isAssetMove={isAssetMove}
                moveAssets={moveAssets}
              />
            );
          }}
        />
      ) : (
        <Text
          style={{ textAlign: "center", color: "white", alignItems: "center" }}
        >
          No folders created
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
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
});
export default Folders;
