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
var wsPingIntervalId = void 0;
async function onAppStateChange(status) {
  console.log(`\u{1F41D} Pocketbee App Status: ${status}`);
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
    wsPingIntervalId = window.setInterval(() => {
      ws == null ? void 0 : ws.send(JSON.stringify({ event: "ping" }));
    }, 1e3 * 60);
  }
  ws.onerror = (ev) => {
    if (store.debugLogs) {
      console.error("\u{1F41D} Pocketbee WS Error", ev);
    }
  };
  ws.onclose = (ev) => {
    if (store.debugLogs) {
      if (ev.code === 1e3) {
        console.info("\u{1F41D} Pocketbee Regular WS Close (code: 1000)");
      } else {
        console.warn("\u{1F41D} Pocketbee Irregular WS Close", ev);
      }
    }
    if (wsPingIntervalId) {
      clearInterval(wsPingIntervalId);
    }
  };
  ws.onmessage = (ev) => {
    if (store.debugLogs) {
      console.info("\u{1F41D} Pocketbee WS Message", ev);
    }
  };
}
async function sendEnd() {
  ws == null ? void 0 : ws.close(1e3);
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
