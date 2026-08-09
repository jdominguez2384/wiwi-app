import { spawnSync } from "node:child_process";
import { access } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const androidDirectory = path.join(root, "android");
const isWindows = process.platform === "win32";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    env: options.env ?? process.env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(isWindows ? "npm.cmd" : "npm", ["run", "native:build"]);
run(isWindows ? "npx.cmd" : "npx", ["cap", "sync", "android"]);
run(isWindows ? "gradlew.bat" : "./gradlew", ["bundleRelease"], {
  cwd: androidDirectory,
  env: {
    ...process.env,
    WIWI_REQUIRE_RELEASE_SIGNING: "true",
  },
});

const bundlePath = path.join(
  androidDirectory,
  "app",
  "build",
  "outputs",
  "bundle",
  "release",
  "app-release.aab"
);
await access(bundlePath);
console.log(`Signed Android App Bundle: ${bundlePath}`);
