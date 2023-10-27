import { AppState, type AppStateStatus } from "react-native";
import { edenTreaty } from "@elysiajs/eden";
import * as SecureStore from "expo-secure-store";
import type { App as IngestionApi } from "@what-the-buzz/ingestion-api";

let projectToken: string;
let userId: string;

const ingestionApi = edenTreaty<IngestionApi>("http://localhost:5050");

const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

async function onAppStateChange(status: AppStateStatus) {
  console.log(status);

  if (status === "background") {
    await sendEnd();
  } else if (status === "active") {
    await sendStart();
  }
}

async function sendStart() {
  await ingestionApi.start.post({
    projectToken,
    userId,
  });
}

async function sendEnd() {
  ingestionApi.end.post({
    projectToken,
    userId,
  });
}

export const whatTheBuzz = {
  init: async (_projectToken: string) => {
    projectToken = _projectToken;
    AppState.addEventListener("change", onAppStateChange);

    const _userId = await SecureStore.getItemAsync(
      "whatthebuzz_uid",
      SECURE_STORE_OPTIONS,
    );
    if (_userId) {
      userId = _userId;
    } else {
      userId = Math.random().toString(36).substring(4);
      await SecureStore.setItemAsync(
        "whatthebuzz_uid",
        userId,
        SECURE_STORE_OPTIONS,
      );
    }

    console.log("🐝 Hello from What the Buzz");
    console.log(`🐝 User ID: ${userId}`);
    sendStart();
  },
};
