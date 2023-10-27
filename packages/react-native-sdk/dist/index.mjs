// src/index.ts
import { AppState } from "react-native";
import { edenTreaty } from "@elysiajs/eden";
import * as SecureStore from "expo-secure-store";
var DEFAULT_API_ROOT = "http://localhost:5050";
var SECURE_STORE_OPTIONS = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};
var store;
async function onAppStateChange(status) {
  console.log(status);
  if (status === "background") {
    await sendEnd();
  } else if (status === "active") {
    await sendStart();
  }
}
async function sendStart() {
  await store.ingestionApi.start.post({
    projectToken: store.projectToken,
    userId: store.userId,
  });
}
async function sendEnd() {
  store.ingestionApi.end.post({
    projectToken: store.projectToken,
    userId: store.userId,
  });
}
var pocketbee = {
  init: async (options) => {
    var _a, _b;
    AppState.addEventListener("change", onAppStateChange);
    let userId = await SecureStore.getItemAsync(
      "pocketbee_uid",
      SECURE_STORE_OPTIONS,
    );
    if (!userId) {
      userId = Math.random().toString(36).substring(4);
      await SecureStore.setItemAsync(
        "pocketbee_uid",
        userId,
        SECURE_STORE_OPTIONS,
      );
    }
    const ingestionApi = edenTreaty(
      (_a = options.apiRoot) != null ? _a : DEFAULT_API_ROOT,
    );
    store = {
      ...options,
      debugLogs: ((_b = options.debugLogs) != null ? _b : __DEV__)
        ? true
        : false,
      userId,
      ingestionApi,
    };
    if (store.debugLogs) {
      console.log("\u{1F41D} Hello from Pocketbee");
      console.log(`\u{1F41D} User ID: ${userId}`);
    }
    sendStart();
  },
};
export { pocketbee };
