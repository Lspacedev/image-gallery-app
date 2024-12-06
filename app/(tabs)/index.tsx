import { useState, useEffect } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

import {
  View,
  FlatList,
  Button,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import PhotoCard from "@/components/PhotoCard";
const Photos = () => {
  const [storagePermission, requestStoragePermission] =
    MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   console.log(storagePermission);
  //   (async () => {
  //     if (storagePermission?.status !== "granted") {
  //       await requestStoragePermission();
  //     }
  //   })();
  // }, [storagePermission]);
  // useEffect(() => {
  //   console.log(
  //     "ddd",
  //     storagePermission && storagePermission.status === "granted"
  //   );
  //   getPhotos();
  // }, []);
  useEffect(() => {
    isFocused && getPhotos();
  }, [isFocused, storagePermission]);
  const getPhotos = async () => {
    setLoading(true);
    if (storagePermission?.status !== "granted") {
      await requestStoragePermission();
    } else {
      let album = await MediaLibrary.getAlbumAsync("Image Gallery");
      console.log({ album });
      if (album !== null) {
        const media = await MediaLibrary.getAssetsAsync({
          album: album,
          mediaType: MediaLibrary.MediaType.photo,
          first: 40,
        });
        if (media !== null) {
          const assets = media.assets;
          setPhotos(assets);
          setLoading(false);
        }
      } else {
        setPhotos([]);
        setLoading(false);
      }
    }
  };

  if (loading) return <ActivityIndicator />;
  console.log({ photos }, photos.length > 0);
  return (
    <View style={styles.container}>
      {photos.length > 0 ? (
        <FlatList
          contentContainerStyle={{ padding: 0 }}
          data={photos}
          numColumns={3}
          columnWrapperStyle={{ gap: 2, marginVertical: 2 }}
          renderItem={({ item }) => {
            return <PhotoCard photo={item} />;
          }}
        />
      ) : (
        <Text
          style={{ textAlign: "center", color: "white", alignItems: "center" }}
        >
          Gallery is empty
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
export default Photos;
