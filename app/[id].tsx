import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, ActivityIndicator } from "react-native";

import { useState, useEffect } from "react";

import * as MediaLibrary from "expo-media-library";
import PhotoHeader from "@/components/PhotoHeader";

import AnimatedImage from "@/components/AnimatedImage";
import RNFS from "react-native-fs";

export default function PhotoScreen() {
  const { folder, id } = useLocalSearchParams();
  const [photo, setPhoto] = useState<MediaLibrary.Asset | string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof folder !== "undefined") {
      getPhoto(folder as string);
    } else {
      getPhoto("Image Gallery");
    }
  }, [folder, id]);
  const getPhoto = async (folderName: string) => {
    if (folderName === "Image Gallery") {
      const directoryPath =
        "file://" +
        RNFS.PicturesDirectoryPath +
        "/Image Gallery/" +
        id +
        ".jpg";

      setPhoto(directoryPath);
      setLoading(false);
    } else {
      const directoryPath =
        "file://" +
        RNFS.PicturesDirectoryPath +
        "/Image Gallery/" +
        folder +
        "/" +
        id +
        ".jpg";

      setPhoto(directoryPath);
      setLoading(false);
    }
  };
  if (loading) return <ActivityIndicator />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <PhotoHeader folder={folder} assetId={id} albumId={folder} />
      <AnimatedImage uri={photo} />
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
