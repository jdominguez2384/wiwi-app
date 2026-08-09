import { access, rename, rm } from "node:fs/promises";
import { spawn } from "node:child_process";

const parkedRoutes = [
  { source: "app/api", parked: ".native-server-routes" },
  {
    source: "app/edit-shift/[id]",
    parked: ".native-legacy-edit-route",
  },
];

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function runNextBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "build"],
      {
        env: {
          ...process.env,
          WIWI_NATIVE_BUILD: "true",
        },
        stdio: "inherit",
      }
    );

    child.on("error", reject);
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

for (const route of parkedRoutes) {
  if (await pathExists(route.parked)) {
    if (await pathExists(route.source)) {
      throw new Error(
        `Both ${route.source} and ${route.parked} exist. Restore the parked route before building.`
      );
    }

    await rename(route.parked, route.source);
  }
}

await Promise.all([
  rm(".next", { recursive: true, force: true }),
  rm(".next-native", { recursive: true, force: true }),
]);

const movedRoutes = [];

try {
  for (const route of parkedRoutes) {
    await rename(route.source, route.parked);
    movedRoutes.push(route);
  }

  process.exitCode = await runNextBuild();
} catch (error) {
  console.error("Unable to build the WIWI native bundle.", error);
  process.exitCode = 1;
} finally {
  for (const route of movedRoutes.reverse()) {
    await rename(route.parked, route.source);
  }
}
