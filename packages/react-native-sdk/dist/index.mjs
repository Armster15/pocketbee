// src/index.ts
import { AppState } from "react-native";
import * as SecureStore from "expo-secure-store";
import { URL } from "react-native-url-polyfill";
var DEFAULT_API_ROOT = "wss://v0-1-ws-pocketbee.armaan.cc/";
var SECURE_STORE_OPTIONS = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};
var store;
var ws = void 0;
async function onAppStateChange(status) {
  console.log(status);
  if (status === "background") {
    await sendEnd();
  } else if (status === "active") {
    await sendStart();
  }
}
async function sendStart() {
  var _a;
  const url = new URL((_a = store.apiRoot) != null ? _a : DEFAULT_API_ROOT);
  url.searchParams.set("projectToken", store.projectToken);
  url.searchParams.set("userId", store.userId);
  if (
    !ws ||
    (ws && (ws.readyState === ws.CLOSING || ws.readyState === ws.CLOSED))
  ) {
    ws = new WebSocket(url.href);
  }
  if (store.debugLogs) {
    ws.onerror = (ev) => {
      console.error("\u{1F41D} Pocketbee WS Error", ev);
    };
    ws.onclose = (ev) => {
      console.warn("\u{1F41D} Pocketbee WS Close", ev);
    };
    ws.onmessage = (ev) => {
      console.info("\u{1F41D} Pocketbee WS Message", ev);
    };
  }
}
async function sendEnd() {
  ws == null ? void 0 : ws.close();
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
