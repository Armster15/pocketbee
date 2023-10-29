import { AppState, type AppStateStatus } from "react-native";
import * as SecureStore from "expo-secure-store";
import type { Options, Store } from "./types";
import { URL } from "react-native-url-polyfill";

const DEFAULT_API_ROOT = "wss://v0-1-ws-pocketbee.armaan.cc/";
const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

let store: Store;
let ws: WebSocket | undefined = undefined;

async function onAppStateChange(status: AppStateStatus) {
  console.log(status);

  if (status === "background") {
    await sendEnd();
  } else if (status === "active") {
    await sendStart();
  }
}

async function sendStart() {
  const url = new URL(store.apiRoot ?? DEFAULT_API_ROOT);
  url.searchParams.set("projectToken", store.projectToken);
  url.searchParams.set("userId", store.userId);

  if (
    !ws ||
    (ws && (ws.readyState === ws.CLOSING || ws.readyState === ws.CLOSED))
  ) {
    ws = new WebSocket(url.href);
  }

  if (store.debugLogs) {
    console.info("Pocketbee WS URL", url.href);

    ws.onerror = (ev) => {
      console.error("Pocketbee WS Error", ev);
    };

    ws.onclose = (ev) => {
      console.warn("Pocketbee WS Close", ev);
    };

    ws.onmessage = (ev) => {
      console.info("Pocketbee WS Message", ev);
    };
  }
}

async function sendEnd() {
  ws?.close();
}

export const pocketbee = {
  init: async (options: Options) => {
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
      debugLogs: options.debugLogs ?? __DEV__ ? true : false,
      userId,
    };

    if (store.debugLogs) {
      console.log("🐝 Hello from Pocketbee");
      console.log(`🐝 User ID: ${userId}`);
    }

    sendStart();
  },
};
