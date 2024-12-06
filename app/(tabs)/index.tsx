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
  useEffect(() => {
    console.log(storagePermission);
    (async () => {
      if (storagePermission?.status !== "granted") {
        await requestStoragePermission();
      }
    })();
  }, []);
  // useEffect(() => {
  //   console.log(
  //     "ddd",
  //     storagePermission && storagePermission.status === "granted"
  //   );
  //   getPhotos();
  // }, []);
  useEffect(() => {
    isFocused && getPhotos();
  }, [isFocused]);
  const getPhotos = async () => {
    setLoading(true);

    let album = await MediaLibrary.getAlbumAsync("Image Gallery");
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
    }
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
            return <PhotoCard photo={item} />;
          }}
        />
      ) : (
        <Text style={{ textAlign: "center", color: "#385747" }}>
          Gallery is empty
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
});
export default Photos;
