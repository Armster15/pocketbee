import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { pocketbee } from "@pocketbee/react-native-sdk";
import { env } from "./env";

pocketbee.init({
  projectToken: env.EXPO_PUBLIC_POCKETBEE_TOKEN,
  apiRoot: env.EXPO_PUBLIC_INGESTION_API_URL,
});

export function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
});
