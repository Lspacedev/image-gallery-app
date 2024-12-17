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
import Fontisto from "@expo/vector-icons/Fontisto";

const IndexHeader = () => {
  const goToCamera = () => {
    router.push("/camera");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Fontisto name="photograph" size={24} color="#C81D25" />
        <Text style={styles.text}>Gallery</Text>
      </View>
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
    height: 90,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#2A2828",
  },
  text: {
    color: "#DAE2DF",
    fontSize: 20,
    fontWeight: "600",
  },
});
export default IndexHeader;
