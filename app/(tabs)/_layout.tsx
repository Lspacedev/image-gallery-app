import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import IndexHeader from "@/components/IndexHeader";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveBackgroundColor: "#2A2828",
        tabBarInactiveBackgroundColor: "#2A2828",
        tabBarActiveTintColor: "whitesmoke",
        tabBarStyle: {
          borderTopWidth: 0.3,
          borderTopColor: "black",
          elevation: 1,
          shadowColor: "#5bc4ff",
          shadowOpacity: 1,
          shadowOffset: {
            height: 1,
            width: 1,
          },
          shadowRadius: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          header: () => {
            return <IndexHeader />;
          },
          tabBarLabel: "Photos",
          tabBarLabelStyle: {
            fontWeight: "600",
            fontSize: 15,
          },
          tabBarItemStyle: { paddingTop: 5 }, //use This for Icon or image
          tabBarActiveTintColor: "#B2CFE6",

          tabBarIcon: ({ color, focused }) => {
            return (
              <FontAwesome
                name="photo"
                size={24}
                color={focused ? "#B2CFE6" : "white"}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="folders"
        options={{
          header: () => {
            return <IndexHeader />;
          },
          headerTitle: "Folders",
          headerStyle: {},
          tabBarLabel: "Folders",
          tabBarLabelStyle: {
            fontWeight: "600",
            fontSize: 15,
          },
          tabBarActiveTintColor: "#B2CFE6",
          tabBarIcon: ({ color, focused }) => {
            return (
              <Feather
                name="folder"
                size={24}
                color={focused ? "#B2CFE6" : "white"}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}
