import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import IndexHeader from "@/components/IndexHeader";
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          header: () => {
            return <IndexHeader />;
          },
          tabBarLabel: "",
          tabBarIcon: ({ color }) => {
            return <FontAwesome name="photo" size={24} color="black" />;
          },
        }}
      />

      <Tabs.Screen
        name="folders"
        options={{
          headerTitle: "Folders",
          headerStyle: {},
          tabBarLabel: "",

          tabBarIcon: ({ color }) => {
            return <Feather name="folder" size={24} color="black" />;
          },
        }}
      />
    </Tabs>
  );
}
