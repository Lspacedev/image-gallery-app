import { useState, useEffect } from "react";

import {
  Text,
  Pressable,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";
import FolderCard from "@/components/FolderCard";
import { updateUri } from "@/db/SQLiteFunctions";
import { useIsFocused } from "@react-navigation/native";
import FAB from "@/components/FAB";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";

type Props = {};
type folderType = {
  name: string;
  size: number;
};
const Folders = (props: Props) => {
  const [folders, setFolders] = useState<folderType[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [name, setName] = useState("");
  const [assetsToMove, setAssetsToMove] = useState<MediaLibrary.Asset[]>([]);
  const isFocused = useIsFocused();
  const [isAssetMove, setIsAssetMove] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getData();
      getAlbums();
    }, [])
  );

  useEffect(() => {
    checkMove();
  }, [assetsToMove, folders]);
  const getData = async () => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem("assetsTo");
      if (data !== null) {
        const arr = JSON.parse(data);
        setAssetsToMove(arr);
        if (arr.length === 0) {
          setIsAssetMove(false);
          setLoading(false);
        } else {
          setIsAssetMove(true);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const getAlbums = async () => {
    setLoading(true);
    try {
      const directoryPath = RNFS.PicturesDirectoryPath + "/Image Gallery";
      const result = await RNFS.readDir(directoryPath);

      const folderNames = result
        .filter((item) => item.isDirectory())
        .map((item) => {
          return { name: item.name, size: item.size };
        });
      setFolders(folderNames);
      setLoading(false);
    } catch (err) {}
  };
  const checkMove = async () => {
    if (assetsToMove.length > 0 && folders.length === 0) {
      Alert.alert("No folders created");
      await AsyncStorage.removeItem("assetsTo");
      router.push("/(tabs)/");
    }
  };
  const moveAssets = async (name: string) => {
    try {
      const fromPath = RNFS.PicturesDirectoryPath + `/Image Gallery/`;
      const destPath =
        RNFS.PicturesDirectoryPath + `/Image Gallery/` + name + "/";

      assetsToMove.map(async (asset) => {
        const filename = asset?.uri.substring(asset?.uri.lastIndexOf("/") + 1);
        RNFS.moveFile(fromPath + filename, destPath + filename)
          .then(async () => {
            RNFS.scanFile(fromPath + filename)
              .then(() => {
                console.log("scanned");
              })
              .catch((err) => {
                console.log(err);
              });
            const fileId = filename?.substring(0, filename.indexOf("."));

            await updateUri(fileId, destPath + filename);
          })

          .catch((err) => {
            console.log(err);
          });
      });
      AsyncStorage.removeItem("assetsTo");
      router.push("/(tabs)");
    } catch (err) {
      console.log(err);
    }
  };
  if (loading)
    return (
      <ActivityIndicator
        color="white"
        style={{ flex: 1, backgroundColor: "black" }}
      />
    );
  const createFolder = async () => {
    try {
      const directoryPath = RNFS.PicturesDirectoryPath + "/Image Gallery";
      const folderPath = `${directoryPath}/${name}`;
      const folderExists = await RNFS.exists(folderPath);
      if (!folderExists) {
        RNFS.mkdir(folderPath)
          .then(() => {
            console.log("Folder created successfully");
            setOpenForm(false);
          })
          .catch((error) => {
            console.error("Error creating folder:", error);
            setOpenForm(false);
          });
        console.log("Persisted folder created:", folderPath);
      } else {
        console.log("Persisted folder already exists:", folderPath);
      }
      getAlbums();
      //router.push("/(tabs)/folders");
    } catch (err) {
      console.log("Error", err);
    }
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
          <View
            style={{
              backgroundColor: "transparent",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.folderName}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter folder name"
                  placeholderTextColor={"#717171"}
                  onChangeText={(text) => setName(text)}
                />

                <Pressable style={styles.button} onPress={() => createFolder()}>
                  <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {folders.length > 0 ? (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 25 }}
          data={folders}
          numColumns={2}
          columnWrapperStyle={{
            gap: 10,
            marginVertical: 2,
          }}
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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            resizeMode="center"
            style={{ height: 100 }}
            source={require("@/assets/images/box_1007913.png")}
          />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              alignItems: "center",
            }}
          >
            No folders created
          </Text>
        </View>
      )}
      {!isAssetMove && <FAB openModal={setOpenForm} />}
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
    paddingVertical: 5,
    paddingHorizontal: 50,
    width: "90%",
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
    backgroundColor: "white",
    width: 300,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  input: {
    borderRadius: 5,
    borderColor: "#BDBDBD",
    padding: 5,
    width: "90%",
    color: "#BDBDBD",
    borderWidth: 0.8,
  },
});
export default Folders;
