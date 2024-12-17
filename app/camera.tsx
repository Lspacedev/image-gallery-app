import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useState, useEffect, useRef, useCallback } from "react";
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
import { router, useFocusEffect } from "expo-router";
import * as Location from "expo-location";
import { initialiseDb, insertData, readData } from "@/db/SQLiteFunctions";
import RNFS from "react-native-fs";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [storagePermission, requestStoragePermission] =
    MediaLibrary.usePermissions();
  const [locationPermission, requestLocationPermission] =
    Location.useForegroundPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [pictureSizes, setPictureSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState(undefined);
  const [location, setLocation] = useState<Location.LocationObject>();
  useFocusEffect(
    useCallback(() => {
      initialiseDb();
      checkIfLocationEnabled();
      getCurrentLocation();
    }, [])
  );
  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync(); //returns true or false
    if (!enabled) {
      //if not enable
      Alert.alert("Location not enabled", "Please enable your Location", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };
  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });

    setLocation(location);
  }

  useEffect(() => {
    async function getSizes() {
      if (permission?.granted && cameraRef.current) {
        const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
        setPictureSizes(sizes);
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
  if (!locationPermission) {
    // location permissions are still loading.
    return <View />;
  }

  if (!locationPermission.granted) {
    // location permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your location permission to show camera
        </Text>
        <Button onPress={requestLocationPermission} title="grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };
  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        if (storagePermission?.status !== "granted") {
          await requestStoragePermission();
        }
        const photo = await cameraRef.current?.takePictureAsync({ quality: 1 });

        if (storagePermission?.status === "granted") {
          const directoryPath = RNFS.PicturesDirectoryPath + "/Image Gallery/";

          const exists = await RNFS.exists(directoryPath);
          if (exists) {
            const filename = photo?.uri.substring(
              photo?.uri.lastIndexOf("/") + 1
            );
            RNFS.moveFile(photo?.uri as string, directoryPath + filename).then(
              async () => {
                RNFS.scanFile(photo?.uri as string)
                  .then(() => {
                    console.log("scanned");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            );
            const fileId = filename?.substring(0, filename.indexOf("."));

            const timeStamp = Date.now();
            const uri = directoryPath + filename;

            await insertData(
              fileId,
              filename,
              uri,
              timeStamp,
              location!.coords.latitude,
              location!.coords.longitude
            );
          } else {
            const res = await RNFS.mkdir(directoryPath);
            const filename = photo?.uri.substring(
              photo?.uri.lastIndexOf("/") + 1
            );
            RNFS.moveFile(photo?.uri as string, directoryPath + filename).then(
              async () => {
                RNFS.scanFile(photo?.uri as string)
                  .then(() => {
                    console.log("scanned");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            );
            const fileId = filename?.substring(0, filename.indexOf("."));

            const timeStamp = Date.now();
            const uri = "file://" + directoryPath + filename;

            await insertData(
              fileId,
              filename,
              uri,
              timeStamp,
              location!.coords.latitude,
              location!.coords.longitude
            );
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
