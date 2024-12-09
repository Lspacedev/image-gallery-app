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
  addAssetsToMove: (assetId: string) => void;
  selected: MediaLibrary.AssetRef[];
};

const PhotoCard: React.FC<PhotoProps> = ({
  photo,
  addAssetsToMove,
  selected,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  useEffect(() => {
    const [id] = selected.filter((id) => id === photo.id);

    if (typeof id !== "undefined") {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selected]);
  return (
    <Link
      href={{
        pathname: "../[id]",
        params: { id: photo.id },
      }}
      onLongPress={() => addAssetsToMove(photo.id)}
    >
      <View style={[styles.container]}>
        <View style={styles.imgContainer}>
          <Image
            source={{ uri: photo.uri }}
            style={[
              styles.img,
              isSelected! && { borderWidth: 6, borderColor: "#90D6FF" },
            ]}
          />
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
