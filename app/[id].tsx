import { useLocalSearchParams, Link, router } from "expo-router";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import { useState, useEffect } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import * as MediaLibrary from "expo-media-library";
import PhotoHeader from "@/components/PhotoHeader";

import AnimatedImage from "@/components/AnimatedImage";

export default function PhotoScreen() {
  const { id } = useLocalSearchParams();
  const [photo, setPhoto] = useState<MediaLibrary.Asset>();
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    console.log({ id });
    getPhoto();
  }, [id]);
  const getPhoto = async () => {
    let album = await MediaLibrary.getAlbumAsync("Image Gallery");

    if (album !== null) {
      const media = await MediaLibrary.getAssetsAsync({
        album: album,
        mediaType: MediaLibrary.MediaType.photo,
        first: 40,
      });
      if (media !== null) {
        const assets = media.assets;
        const [asset] = assets.filter((photo) => photo.id === id);
        setPhoto(asset);
      }
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <PhotoHeader assetId={photo?.id ?? ""} albumId={photo?.albumId ?? ""} />
      <AnimatedImage uri={photo?.uri} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  nav: {
    height: 200,
    backgroundColor: "transparent",
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  backArrow: {
    color: "white",
    backgroundColor: "black",
    padding: 5,
    borderRadius: 50,
  },
  arrowText: {
    color: "whitesmoke",
  },
  imgContainer: {},
  img: { flex: 1 },
  details: {
    marginTop: -30,
    paddingTop: 15,
    padding: 25,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: "white",
    fontFamily: "Poppins_400Regular",
  },
  timeContainer: {
    marginVertical: 30,
    flexDirection: "row",
  },
  icon: {
    backgroundColor: "#e1ecfa",
    color: "#121b27",
    padding: 5,
    borderRadius: 10,
  },
  infoContainer: {
    marginVertical: 25,
    fontFamily: "Poppins_400Regular",
  },
  button: {
    backgroundColor: "#C0D461",
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#010709",
    textAlign: "center",
    textTransform: "uppercase",
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
});
