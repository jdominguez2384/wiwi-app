import { Capacitor } from "@capacitor/core";
import {
  Directory,
  Encoding,
  Filesystem,
} from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

export function canShareNativeFile() {
  return Capacitor.isNativePlatform();
}

export async function shareNativeTextFile(
  contents: string,
  filename: string,
  title: string
) {
  const result = await Filesystem.writeFile({
    path: filename,
    data: contents,
    directory: Directory.Cache,
    encoding: Encoding.UTF8,
  });

  await Share.share({
    title,
    url: result.uri,
    dialogTitle: title,
  });
}

export async function shareNativeBase64File(
  base64: string,
  filename: string,
  title: string
) {
  const result = await Filesystem.writeFile({
    path: filename,
    data: base64,
    directory: Directory.Cache,
  });

  await Share.share({
    title,
    url: result.uri,
    dialogTitle: title,
  });
}
