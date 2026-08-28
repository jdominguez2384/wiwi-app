import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const background = "#020617";
const iconSource = await readFile(path.join(root, "public", "wiwi-icon.svg"));
const maskableSource = await readFile(
  path.join(root, "public", "wiwi-maskable.svg")
);

async function ensureParent(outputPath) {
  await mkdir(path.dirname(outputPath), { recursive: true });
}

async function writeOpaqueIcon(source, size, outputPath) {
  await ensureParent(outputPath);
  await sharp(source)
    .resize(size, size)
    .flatten({ background })
    .png()
    .toFile(outputPath);
}

async function writeFavicon(source, outputPath) {
  await ensureParent(outputPath);
  const size = 32;
  const png = await sharp(source)
    .resize(size, size)
    .flatten({ background })
    .ensureAlpha()
    .png()
    .toBuffer();
  const header = Buffer.alloc(22);

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(header.length, 18);

  await writeFile(outputPath, Buffer.concat([header, png]));
}

async function writeForeground(size, outputPath) {
  await ensureParent(outputPath);
  const logoSize = Math.round(size * 0.7);
  const logo = await sharp(maskableSource)
    .resize(logoSize, logoSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: logo,
        left: Math.round((size - logoSize) / 2),
        top: Math.round((size - logoSize) / 2),
      },
    ])
    .png()
    .toFile(outputPath);
}

async function writeSplash(width, height, outputPath) {
  await ensureParent(outputPath);
  const logoSize = Math.round(Math.min(width, height) * 0.3);
  const logo = await sharp(iconSource)
    .resize(logoSize, logoSize)
    .flatten({ background })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background,
    },
  })
    .composite([
      {
        input: logo,
        left: Math.round((width - logoSize) / 2),
        top: Math.round((height - logoSize) / 2),
      },
    ])
    .png()
    .toFile(outputPath);
}

const androidDensities = {
  mdpi: { icon: 48, foreground: 108 },
  hdpi: { icon: 72, foreground: 162 },
  xhdpi: { icon: 96, foreground: 216 },
  xxhdpi: { icon: 144, foreground: 324 },
  xxxhdpi: { icon: 192, foreground: 432 },
};

for (const [density, sizes] of Object.entries(androidDensities)) {
  const directory = path.join(
    root,
    "android",
    "app",
    "src",
    "main",
    "res",
    `mipmap-${density}`
  );

  await writeOpaqueIcon(iconSource, sizes.icon, path.join(directory, "ic_launcher.png"));
  await writeOpaqueIcon(iconSource, sizes.icon, path.join(directory, "ic_launcher_round.png"));
  await writeForeground(
    sizes.foreground,
    path.join(directory, "ic_launcher_foreground.png")
  );
}

const androidSplashes = {
  drawable: [480, 320],
  "drawable-land-mdpi": [480, 320],
  "drawable-land-hdpi": [800, 480],
  "drawable-land-xhdpi": [1280, 720],
  "drawable-land-xxhdpi": [1600, 960],
  "drawable-land-xxxhdpi": [1920, 1280],
  "drawable-port-mdpi": [320, 480],
  "drawable-port-hdpi": [480, 800],
  "drawable-port-xhdpi": [720, 1280],
  "drawable-port-xxhdpi": [960, 1600],
  "drawable-port-xxxhdpi": [1280, 1920],
};

for (const [directory, [width, height]] of Object.entries(androidSplashes)) {
  await writeSplash(
    width,
    height,
    path.join(
      root,
      "android",
      "app",
      "src",
      "main",
      "res",
      directory,
      "splash.png"
    )
  );
}

const iosIcon = path.join(
  root,
  "ios",
  "App",
  "App",
  "Assets.xcassets",
  "AppIcon.appiconset",
  "AppIcon-512@2x.png"
);
await writeOpaqueIcon(iconSource, 1024, iosIcon);

const iosSplashDirectory = path.join(
  root,
  "ios",
  "App",
  "App",
  "Assets.xcassets",
  "Splash.imageset"
);
for (const name of [
  "splash-2732x2732.png",
  "splash-2732x2732-1.png",
  "splash-2732x2732-2.png",
]) {
  await writeSplash(2732, 2732, path.join(iosSplashDirectory, name));
}

await writeOpaqueIcon(
  iconSource,
  192,
  path.join(root, "public", "wiwi-icon-192.png")
);
await writeOpaqueIcon(
  iconSource,
  512,
  path.join(root, "public", "wiwi-icon-512.png")
);
await writeOpaqueIcon(
  maskableSource,
  512,
  path.join(root, "public", "wiwi-maskable-512.png")
);
await writeFavicon(iconSource, path.join(root, "app", "favicon.ico"));

console.log("Generated WIWI native and PWA assets.");
