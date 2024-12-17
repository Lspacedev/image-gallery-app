import { Stack } from "expo-router";
import { View, Text } from "react-native";
type ParamsType = {
  folder: string;
};
export default function Root() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="camera"
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#2A2828",
          },
          headerTintColor: "white",
        }}
      />

      <Stack.Screen
        name="folders/[folder]"
        options={({ route }) => ({
          headerShown: true,
          headerTitle: `${
            (route.params as ParamsType).folder.indexOf("%") !== -1
              ? (route.params as ParamsType).folder.replace("%20", " ")
              : (route.params as ParamsType).folder
          }`,
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "#2A2828",
          },
        })}
      />

      <Stack.Screen
        name="[id]/details"
        options={{
          headerShown: true,
          headerTitle: "Details",
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "#2A2828",
          },
        }}
      />
      <Stack.Screen
        name="[id]/map"
        options={{
          headerShown: true,
          headerTitle: "Map",
          headerStyle: {
            backgroundColor: "grey",
          },
        }}
      />
    </Stack>
  );
}
