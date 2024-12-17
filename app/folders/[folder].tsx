import { useLocalSearchParams } from "expo-router";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Text,
  Image,
  Dimensions,
} from "react-native";

import { useState, useEffect } from "react";

import FolderPhotoCard from "@/components/FolderPhotoCard";
import RNFS from "react-native-fs";
type ItemType = {
  name: string;
  path: string;
};
export default function FolderScreen() {
  const { folder } = useLocalSearchParams();

  const [photos, setPhotos] = useState<ItemType[]>([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getPhotos();
  }, [folder]);
  const getPhotos = async () => {
    setLoading(true);
    const directoryPath =
      RNFS.PicturesDirectoryPath + "/Image Gallery/" + folder;
    const result = await RNFS.readDir(directoryPath);

    const paths = result
      .filter((item) => item.isFile())
      .map((item) => {
        console.log({ item });
        return {
          name: item.name.substring(0, item.name.indexOf(".")),
          path: item.path,
        };
      });
    setPhotos(paths);
    setLoading(false);
  };
  if (loading) return <ActivityIndicator />;
  return (
    <View style={styles.container}>
      {photos.length > 0 ? (
        <FlatList
          contentContainerStyle={{ padding: 0 }}
          data={photos}
          numColumns={3}
          columnWrapperStyle={{ gap: 2, marginVertical: 2 }}
          renderItem={({ item }) => {
            return <FolderPhotoCard photo={item} folder={folder as string} />;
          }}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            resizeMode="center"
            style={{ height: 100 }}
            source={require("@/assets/images/unboxing_11746107.png")}
          />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              alignItems: "center",
            }}
          >
            No photos in folder
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  imgContainer: {
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").width / 3,
  },
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
