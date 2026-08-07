import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.getwiwi.app",
  appName: "WIWI",
  webDir: "native-shell",
  server: {
    // Internal-test builds use the deployed app until a bundled native build is ready.
    url: "https://getwiwi.com",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "automatic",
  },
};

export default config;
