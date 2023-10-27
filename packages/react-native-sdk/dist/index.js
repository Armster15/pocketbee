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
var src_exports = {};
__export(src_exports, {
  pocketbee: () => pocketbee,
});
module.exports = __toCommonJS(src_exports);
var import_react_native = require("react-native");
var import_eden = require("@elysiajs/eden");
var SecureStore = __toESM(require("expo-secure-store"));
var projectToken;
var userId;
var ingestionApi = (0, import_eden.edenTreaty)("http://localhost:5050");
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
      import_react_native.AppState.addEventListener("change", onAppStateChange);
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
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    pocketbee,
  });
