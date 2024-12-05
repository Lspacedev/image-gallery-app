import { useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

import {
  ScrollView,
  Button,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
type Props = {};
type InputType =
  | string
  | Number
  | NativeSyntheticEvent<TextInputChangeEventData>;
const Folders = (props: Props) => {
  //   const [name, setName] = useState<InputType>("");

  return <ScrollView contentContainerStyle={styles.container}></ScrollView>;
};

const styles = StyleSheet.create({
  container: {},
});
export default Folders;
