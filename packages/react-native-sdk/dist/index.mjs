var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) =>
      x.done
        ? resolve(x.value)
        : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
import { AppState } from "react-native";
import { edenTreaty } from "@elysiajs/eden";
import * as SecureStore from "expo-secure-store";
var projectToken;
var userId;
var ingestionApi = edenTreaty("http://localhost:5050");
var SECURE_STORE_OPTIONS = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};
function onAppStateChange(status) {
  return __async(this, null, function* () {
    console.log(status);
    if (status === "background") {
      yield sendEnd();
    } else if (status === "active") {
      yield sendStart();
    }
  });
}
function sendStart() {
  return __async(this, null, function* () {
    yield ingestionApi.start.post({
      projectToken,
      userId,
    });
  });
}
function sendEnd() {
  return __async(this, null, function* () {
    ingestionApi.end.post({
      projectToken,
      userId,
    });
  });
}
var pocketbee = {
  init: (_projectToken) =>
    __async(void 0, null, function* () {
      projectToken = _projectToken;
      AppState.addEventListener("change", onAppStateChange);
      const _userId = yield SecureStore.getItemAsync(
        "pocketbee_uid",
        SECURE_STORE_OPTIONS,
      );
      if (_userId) {
        userId = _userId;
      } else {
        userId = Math.random().toString(36).substring(4);
        yield SecureStore.setItemAsync(
          "pocketbee_uid",
          userId,
          SECURE_STORE_OPTIONS,
        );
      }
      console.log("\u{1F41D} Hello from Pocketbee");
      console.log(`\u{1F41D} User ID: ${userId}`);
      sendStart();
    }),
};
export { pocketbee };
