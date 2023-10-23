import { AppState, type AppStateStatus } from "react-native";

let projectToken: string;

async function onAppStateChange(status: AppStateStatus) {
  console.log(status);

  if (status === "background") {
    await sendEnd();
  } else if (status === "active") {
    await sendStart();
  }
}

async function sendStart() {
  // TODO implement /start api end point
  // await app.start.post({
  //   projectToken,
  //   userId: "1",
  // });
}

async function sendEnd() {
  // TODO implement /end api end point
  // app.end.post({
  //   projectToken,
  //   userId: "1",
  // });
}

export const whatTheBuzz = {
  init: (token: string) => {
    projectToken = token;
    AppState.addEventListener("change", onAppStateChange);

    console.log("Hello from What the Buzz");
    sendStart();
  },
};
