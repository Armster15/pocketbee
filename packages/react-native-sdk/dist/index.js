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
var import_url_join = __toESM(require("url-join"));
var SecureStore = __toESM(require("expo-secure-store"));
var DEFAULT_API_ROOT = "https://pocketbee.armaan.cc/api/ingestion/v0.1/";
var SECURE_STORE_OPTIONS = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};
var store;
async function onAppStateChange(status) {
  console.log(status);
  if (status === "background") {
    await sendEnd();
  } else if (status === "active") {
    await sendStart();
  }
}
async function ingestionApi(endpoint, options) {
  var _a;
  const { headers, ...otherOptions } = options != null ? options : {};
  return await fetch(
    (0, import_url_join.default)(
      (_a = store.apiRoot) != null ? _a : DEFAULT_API_ROOT,
      endpoint,
    ),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...otherOptions,
    },
  );
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
