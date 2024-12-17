import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
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
type ItemType = {
  name: string;
  path: string;
};
type PhotoProps = {
  photo: ItemType;
  folder: string;
};

const FolderPhotoCard: React.FC<PhotoProps> = ({ photo, folder }) => {
  console.log({ photo });
  return (
    <Link
      href={{
        pathname: "../[id]",
        params: { folder: folder, id: photo.name },
      }}
    >
      <View style={[styles.container]}>
        <View style={styles.imgContainer}>
          <Image
            source={{ uri: "file://" + photo.path }}
            style={[styles.img]}
          />
        </View>
      </View>
    </Link>
  );
};
export default FolderPhotoCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").width / 3,
  },
  selected: {
    flex: 1,
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").width / 3,
    borderWidth: 1,
    borderColor: "lightBlue",
  },
  imgContainer: {
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").width / 3,
  },
  img: {
    flex: 1,
  },
});
