import { AppState, type AppStateStatus } from "react-native";
import urlJoin from "url-join";
import * as SecureStore from "expo-secure-store";
import type { Options, Store } from "./types";

const DEFAULT_API_ROOT = "https://pocketbee.armaan.cc/api/ingestion/v0.1/";
const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

let store: Store;

async function onAppStateChange(status: AppStateStatus) {
  console.log(status);

  if (status === "background") {
    await sendEnd();
  } else if (status === "active") {
    await sendStart();
  }
}

async function ingestionApi(endpoint: string, options?: RequestInit) {
  const { headers, ...otherOptions } = options ?? {};

  return await fetch(urlJoin(store.apiRoot ?? DEFAULT_API_ROOT, endpoint), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...otherOptions,
  });
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
