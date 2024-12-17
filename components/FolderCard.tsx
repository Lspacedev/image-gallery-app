import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import * as MediaLibrary from "expo-media-library";
import AntDesign from "@expo/vector-icons/AntDesign";
import RNFS from "react-native-fs";

type folderType = {
  name: string;
  size: number;
};

type FolderProps = {
  folder: folderType;
  isAssetMove: boolean;
  moveAssets: (text: string) => void;
};

const FolderCard: React.FC<FolderProps> = ({
  folder,
  isAssetMove,
  moveAssets,
}) => {
  const [photo, setPhoto] = useState<string>();

  useEffect(() => {
    getPhoto();
  }, []);
  const goToFolder = () => {
    router.push({
      pathname: "../folders/[folder]",
      params: { folder: folder.name },
    });
  };
  const getPhoto = async () => {
    const folderPath =
      RNFS.PicturesDirectoryPath + `/Image Gallery/` + folder.name;
    const result = await RNFS.readDir(folderPath);

    const photoPaths = result
      .filter((item) => item.isFile())
      .map((item) => {
        return item.path;
      });
    if (photoPaths.length > 0) {
      setPhoto("file://" + photoPaths[0]);
    } else {
      setPhoto("");
    }
  };
  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={isAssetMove ? () => moveAssets(folder.name) : () => goToFolder()}
    >
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          {photo && photo !== "" ? (
            <Image
              source={{ uri: photo }}
              style={{ flex: 1, borderRadius: 15 }}
            />
          ) : (
            <AntDesign name="folder1" style={styles.icon} />
          )}
        </View>
        <Text style={styles.text}>{folder.name}</Text>
      </View>
    </Pressable>
  );
};
export default FolderCard;

const styles = StyleSheet.create({
  container: {},
  selected: {
    flex: 1,
    borderWidth: 1,
    borderColor: "lightBlue",
  },
  imgContainer: {
    height: 150,
    borderRadius: 15,
  },

  icon: {
    flex: 1,
    fontSize: 100,
  },
  text: {
    flex: 1,
    color: "white",
    fontSize: 14,
  },
});
