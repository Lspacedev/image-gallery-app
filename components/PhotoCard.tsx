import React, { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import {
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as MediaLibrary from "expo-media-library";
type PhotoType = {
  id: string;
  uri: string;
};
type PhotoProps = {
  photo: PhotoType;
  addAssetsToMove: (assetId: string) => void;
  selected: string[];
  selector: boolean;
  setSelector: (bool: boolean) => void;
};

const PhotoCard: React.FC<PhotoProps> = ({
  photo,
  addAssetsToMove,
  selected,
  selector,
  setSelector,
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
  const goToImage = () => {
    router.push({
      pathname: "../[id]",
      params: { id: photo.id },
    });
  };
  console.log({ selector });
  return (
    // <Link
    //   href={{
    //     pathname: "../[id]",
    //     params: { id: photo.id },
    //   }}
    //   onLongPress={() => addAssetsToMove(photo.id)}
    // >
    //   <View style={[styles.container]}>
    //     <View style={styles.imgContainer}>
    //       <Image
    //         source={{ uri: photo.uri }}
    //         style={[
    //           styles.img,
    //           isSelected! && { borderWidth: 6, borderColor: "#90D6FF" },
    //         ]}
    //       />
    //     </View>
    //   </View>
    // </Link>
    <Pressable
      style={[styles.container]}
      onPress={selector ? () => addAssetsToMove(photo.id) : () => goToImage()}
      onLongPress={() => {
        setSelector(true);
        addAssetsToMove(photo.id);
      }}
    >
      {selector && (
        <View>
          {isSelected ? (
            <MaterialIcons name="radio-button-checked" style={styles.radio} />
          ) : (
            <MaterialIcons name="radio-button-unchecked" style={styles.radio} />
          )}
        </View>
      )}
      <View style={styles.imgContainer}>
        <Image
          source={{ uri: photo.uri }}
          style={[
            styles.img,
            isSelected! && { borderWidth: 6, borderColor: "#90D6FF" },
          ]}
        />
      </View>
    </Pressable>
  );
};
export default PhotoCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").width / 3,
    position: "relative",
  },
  selected: {
    flex: 1,
    width: Dimensions.get("window").width / 3 - 5,
    height: Dimensions.get("window").width / 3 - 5,
    borderWidth: 5,
    borderColor: "lightBlue",
  },
  imgContainer: {
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").width / 3,
  },
  img: {
    flex: 1,
  },
  radio: {
    flex: 1,
    position: "absolute",
    zIndex: 1,
    fontSize: 25,
    color: "white",
  },
});
