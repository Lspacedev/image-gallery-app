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

type PhotoProps = {
  photo: MediaLibrary.Asset;
  folder: string;
};

const FolderPhotoCard: React.FC<PhotoProps> = ({ photo, folder }) => {
  return (
    <Link
      href={{
        pathname: "../[id]",
        params: { folder: folder, id: photo.id },
      }}
    >
      <View style={[styles.container]}>
        <View style={styles.imgContainer}>
          <Image source={{ uri: photo.uri }} style={[styles.img]} />
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
    width: Dimensions.get("window").width / 3,
    height: 180,
  },
  img: {
    flex: 1,
  },
});
