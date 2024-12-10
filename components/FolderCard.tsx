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
  const goToFolder = () => {
    router.push({
      pathname: "../folders/[folder]",
      params: { folder: folder.name },
    });
  };
  console.log({ isAssetMove });
  return (
    // <Link
    //   href={{
    //     pathname: "../folders/[folder]",
    //     params: { folder: folder.name },
    //   }}
    // >
    <Pressable
      style={{ flex: 1 }}
      onPress={isAssetMove ? () => moveAssets(folder.name) : () => goToFolder()}
    >
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <AntDesign name="folder1" style={styles.icon} />
        </View>
        <Text style={styles.text}>{folder.name}</Text>
      </View>
    </Pressable>
    // </Link>
  );
};
export default FolderCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width / 3,
    height: 180,
  },
  selected: {
    flex: 1,
    width: Dimensions.get("window").width / 3,
    height: 180,
    borderWidth: 1,
    borderColor: "lightBlue",
  },
  imgContainer: {
    flex: 1,
    width: Dimensions.get("window").width / 3,
    height: 180,
  },

  icon: {
    flex: 1,
    fontSize: 100,
    color: "grey",
  },
  text: {
    flex: 1,
    color: "black",
    fontSize: 18,
  },
});
