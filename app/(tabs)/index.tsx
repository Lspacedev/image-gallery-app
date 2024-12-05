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
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import PhotoCard from "@/components/PhototCard";
const Photos = () => {
  const [storagePermission, requestStoragePermission] =
    MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  useEffect(() => {
    console.log(storagePermission);
    (async () => {
      if (storagePermission?.status !== "granted") {
        await requestStoragePermission();
      }
    })();
  }, []);
  useEffect(() => {
    getPhotos();
  }, []);
  const getPhotos = async () => {
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
      }
    }
  };
  return (
    <View style={styles.container}>
      {photos?.length > 0 ? (
        <FlatList
          data={photos}
          numColumns={2}
          columnWrapperStyle={{
            gap: 0,
            justifyContent: "space-around",
          }}
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
  container: {},
});
export default Photos;
