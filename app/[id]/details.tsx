import { useLocalSearchParams, Link, router } from "expo-router";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import { useState, useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import PhotoHeader from "@/components/PhotoHeader";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import AnimatedImage from "@/components/AnimatedImage";
import { readData } from "@/db/SQLiteFunctions";

export default function PhotoScreen() {
  const { id } = useLocalSearchParams();
  const [metaData, setMetaData] = useState<any>({});

  useEffect(() => {
    getMetaData();
  }, [id]);
  const getMetaData = async () => {
    const data = await readData(id);
    setMetaData(data[0]);
  };
  console.log({ metaData });
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.view}>
        <AntDesign name="file1" size={24} color="black" />

        <Text style={styles.text}>{metaData.filename}</Text>
      </View>

      <View style={styles.view}>
        <Feather name="calendar" size={24} color="black" />
        <Text style={styles.text}>{metaData.timestamp}</Text>
      </View>
      <View style={styles.view}>
        <Feather name="folder" size={24} color="black" />
        <Text style={styles.text}>{metaData.uri}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "grey",
    paddingHorizontal: 25,
    paddingVertical: 25,
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
  view: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 25,
  },
  text: {
    color: "white",
  },
});
