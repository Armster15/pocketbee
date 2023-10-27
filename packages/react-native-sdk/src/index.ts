import { AppState, type AppStateStatus } from "react-native";
import { edenTreaty } from "@elysiajs/eden";
import * as SecureStore from "expo-secure-store";
import type { App as IngestionApi } from "@pocketbee/ingestion-api";
import type { Options, Store } from "./types";

const DEFAULT_API_ROOT = "http://localhost:5050";
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

    const ingestionApi = edenTreaty<IngestionApi>(
      options.apiRoot ?? DEFAULT_API_ROOT,
    );

    store = {
      ...options,
      debugLogs: options.debugLogs ?? __DEV__ ? true : false,
      userId,
      ingestionApi,
    };

    if (store.debugLogs) {
      console.log("🐝 Hello from Pocketbee");
      console.log(`🐝 User ID: ${userId}`);
    }

    sendStart();
  },
};
