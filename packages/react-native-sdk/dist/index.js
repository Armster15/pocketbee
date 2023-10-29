"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, "default", { value: mod, enumerable: true })
      : target,
    mod,
  )
);
var __toCommonJS = (mod) =>
  __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  pocketbee: () => pocketbee,
});
module.exports = __toCommonJS(src_exports);
var import_react_native = require("react-native");
var SecureStore = __toESM(require("expo-secure-store"));
var import_react_native_url_polyfill = require("react-native-url-polyfill");
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
  const url = new import_react_native_url_polyfill.URL(
    (_a = store.apiRoot) != null ? _a : DEFAULT_API_ROOT,
  );
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
    import_react_native.AppState.addEventListener("change", onAppStateChange);
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
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    pocketbee,
  });
