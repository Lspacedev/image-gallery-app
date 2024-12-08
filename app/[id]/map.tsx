import React from "react";
import { useLocalSearchParams, Link, router } from "expo-router";
import { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { readData } from "@/db/SQLiteFunctions";
import { Platform } from "react-native";
export default function Map() {
  const { id } = useLocalSearchParams();
  const [metaData, setMetaData] = useState<any>({});
  const [coords, setCoords] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getMetaData();
  }, [id]);
  const getMetaData = async () => {
    const [data] = await readData(id);
    setCoords({ latitude: data.lat, longitude: data.long });
    setLoading(false);
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
      >
        <Marker
          coordinate={{
            latitude: coords.latitude,
            longitude: coords.longitude,
          }}
          title="My Location"
          description="This is a marker in San Francisco"
        />
      </MapView>
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
