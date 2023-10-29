// src/index.ts
import { AppState } from "react-native";
import urlJoin from "url-join";
import * as SecureStore from "expo-secure-store";
var DEFAULT_API_ROOT = "https://pocketbee.armaan.cc/api/ingestion/v0.1/";
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
async function ingestionApi(endpoint, options) {
  var _a;
  const { headers, ...otherOptions } = options != null ? options : {};
  return await fetch(
    urlJoin((_a = store.apiRoot) != null ? _a : DEFAULT_API_ROOT, endpoint),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...otherOptions,
    },
  );
}
async function sendStart() {
  await ingestionApi("start", {
    body: JSON.stringify({
      projectToken: store.projectToken,
      userId: store.userId,
    }),
  });
}
async function sendEnd() {
  await ingestionApi("end", {
    body: JSON.stringify({
      projectToken: store.projectToken,
      userId: store.userId,
    }),
  });
}
var pocketbee = {
  init: async (options) => {
    var _a;
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
    store = {
      ...options,
      debugLogs: ((_a = options.debugLogs) != null ? _a : __DEV__)
        ? true
        : false,
      userId,
    };
    if (store.debugLogs) {
      console.log("\u{1F41D} Hello from Pocketbee");
      console.log(`\u{1F41D} User ID: ${userId}`);
    }
    sendStart();
  },
};
export { pocketbee };
