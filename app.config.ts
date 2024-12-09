import { ExpoConfig, ConfigContext } from "@expo/config";
import * as dotenv from "dotenv";

// initialize dotenv
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "image-gallery-app",
  name: "image-gallery-app",
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.lspacedev.imagegalleryapp",
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_CLOUD_API_KEY,
      },
    },
  },
});
