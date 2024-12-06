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
  console.log({ photo });
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
    width: Dimensions.get("window").width / 3,
    height: 180,
  },
  imgContainer: {
    width: Dimensions.get("window").width / 3,
    height: 180,
  },
  img: {
    flex: 1,
  },
});
