import React from "react";
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
};

const PhotoCard: React.FC<PhotoProps> = ({ photo }) => {
  return (
    <Link
      href={{
        pathname: "../[id]",
        params: { id: photo.id },
      }}
    >
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Image source={{ uri: photo.uri }} style={styles.img} />
        </View>
      </View>
    </Link>
  );
};
export default PhotoCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: (Dimensions.get("window").width - 60) / 2,
    height: 200,
    borderRadius: 25,
    marginTop: 15,
  },
  imgContainer: {
    width: (Dimensions.get("window").width - 60) / 2,
    height: 180,
    borderRadius: 25,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  img: {
    flex: 1,
    borderRadius: 25,
  },
  recipeText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    fontWeight: 600,
  },
});
