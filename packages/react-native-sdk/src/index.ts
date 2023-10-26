import { AppState, type AppStateStatus } from "react-native";
import { edenTreaty } from "@elysiajs/eden";
import type { App as IngestionApi } from "@what-the-buzz/ingestion-api";

let projectToken: string;
let userId: string;

const ingestionApi = edenTreaty<IngestionApi>("http://localhost:5050");

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
  init: (_projectToken: string) => {
    projectToken = _projectToken;
    AppState.addEventListener("change", onAppStateChange);

    console.log("Hello from What the Buzz");
    // TODO: Better handling of user id
    userId = "1";
    sendStart();
  },
  identify: (_userId: string) => {
    userId = _userId;
  },
};
