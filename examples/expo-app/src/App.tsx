import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { whatTheBuzz } from "@what-the-buzz/react-native-sdk";
import { env } from "./env";

whatTheBuzz.init(env.EXPO_PUBLIC_WHATTHEBUZZ_TOKEN);

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
