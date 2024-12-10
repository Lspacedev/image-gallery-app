import Feather from "@expo/vector-icons/Feather";
import {
  View,
  Pressable,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
} from "react-native";
import { router } from "expo-router";

const IndexHeader = () => {
  const goToCamera = () => {
    router.push("/camera");
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Gallery</Text>
      <Pressable onPress={goToCamera}>
        <Feather name="camera" size={24} color="white" />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingTop: StatusBar.currentHeight,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "black",
  },
  text: {
    color: "white",
  },
});
export default IndexHeader;
