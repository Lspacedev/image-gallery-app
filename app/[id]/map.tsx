import React from "react";
import { useLocalSearchParams, Link, router } from "expo-router";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { readData } from "@/db/SQLiteFunctions";

export default function Map() {
  const { id } = useLocalSearchParams();
  const [metaData, setMetaData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getMetaData();
  }, [id]);
  const getMetaData = async () => {
    const data = await readData(id);
    setLoading(false);
    setMetaData(data[0]);
  };
  console.log(loading, metaData);
  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: metaData.lat,
          longitude: metaData.long,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: metaData.lat,
            longitude: metaData.long,
          }}
          title="My Location"
          description="This is a marker in San Francisco"
        />
      </MapView> */}
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
