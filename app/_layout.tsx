import { Stack } from "expo-router";
export default function Root() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]/details"
        options={{
          headerShown: true,
          headerTitle: "Details",
          headerStyle: {
            backgroundColor: "grey",
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
