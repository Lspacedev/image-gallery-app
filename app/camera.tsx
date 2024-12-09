import {
  Camera,
  CameraView,
  CameraType,
  useCameraPermissions,
} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import * as Location from "expo-location";

import { initialiseDb, insertData, readData } from "@/db/SQLiteFunctions";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [storagePermission, requestStoragePermission] =
    MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);
  const [pictureSizes, setPictureSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState(undefined);
  useEffect(() => {
    (async () => {
      await initialiseDb();
    })();
  }, []);
  useEffect(() => {
    async function getSizes() {
      console.log("hi!");
      console.log(permission);
      if (permission?.granted && cameraRef.current) {
        console.log("sized!");
        const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
        setPictureSizes(sizes);
        console.log(sizes);
      }
    }

    getSizes();
  }, [permission, cameraRef]);
  if (permission?.granted) {
    console.log("graaaaanted");
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };
  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current?.takePictureAsync({ quality: 1 });
        if (storagePermission?.status !== "granted") {
          await requestStoragePermission();
        }
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        if (storagePermission?.status === "granted") {
          const asset = await MediaLibrary.createAssetAsync(photo!.uri);
          const album = await MediaLibrary.getAlbumAsync("Image Gallery");
          if (album == null) {
            const image = await MediaLibrary.createAlbumAsync(
              "Image Gallery",
              asset,
              false
            );
            //add metadata to sqlite db
            const filename = asset.filename;
            const timeStamp = Date.now();
            const uri = asset.uri;
          } else {
            const image = await MediaLibrary.addAssetsToAlbumAsync(
              [asset],
              album,
              false
            );
            //add metadata to sqlite db
            const id = Number(asset.id) + 1;
            const filename = asset.filename;
            const timeStamp = Date.now();
            const uri = asset.uri;
            console.log({
              id,
              filename,
              uri,
              timeStamp,
              lat: location.coords.latitude,
              long: location.coords.longitude,
            });
            const insertRes = await insertData(
              id,
              filename,
              uri,
              timeStamp,
              location.coords.latitude,
              location.coords.longitude
            );

            const read = await readData(asset.id);
            console.log({ read });
          }
        } else {
          Alert.alert("Storage permission needed to save image.");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  const goToPhotos = () => {
    router.back();
  };
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        pictureSize={selectedSize}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={goToPhotos}>
            <FontAwesome name="photo" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <FontAwesome5 name="camera" size={45} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <MaterialIcons name="flip-camera-android" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
