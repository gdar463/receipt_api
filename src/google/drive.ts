import { google } from "googleapis";
import { getAuthClient } from "./token";
import type { GaxiosResponse } from "gaxios";
import type { Readable } from "stream";

export type FileInfo = {
  name: string;
  mime: string;
  body: any;
  properties?: {
    [key: string]: string;
  };
};

export type QueryInfo = {
  name?: string;
  mime?: string;
  properties?: {
    [key: string]: string;
  };
};

export async function createFile(file: FileInfo, userId: string) {
  const authClient = await getAuthClient(userId);
  const drive = google.drive({ version: "v3", auth: authClient });
  const driveFile = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: ["appDataFolder"],
      properties: file.properties,
    },
    media: {
      mimeType: file.mime,
      body: file.body,
    },
    fields: "id",
  });
  return driveFile.data.id;
}

export async function getFileByID(fileId: string, userId: string) {
  const authClient = await getAuthClient(userId);
  const drive = google.drive({ version: "v3", auth: authClient });
  const driveFile = (await drive.files.get({
    fileId: fileId,
    alt: "media",
  })) as GaxiosResponse<Readable>;
  return driveFile.data;
}

export async function listFiles(queryInfo: QueryInfo, userId: string) {
  const authClient = await getAuthClient(userId);
  const drive = google.drive({ version: "v3", auth: authClient });
  let properties = "";
  if (queryInfo.properties) {
    const array = Object.entries(queryInfo.properties);
    properties = "properties has { ";
    for (let i = 0; i < array.length; i++) {
      properties += `${array[i][0]}='${array[i][0]}'${i != array.length - 1 ? " and " : " } "}`;
    }
  }
  const list = await drive.files.list({
    q:
      `${queryInfo.name ? `name = ${queryInfo.name} ` : ""}` +
      `${queryInfo.mime ? `mimeType = '${queryInfo.mime}' ` : ""}` +
      `${properties}` +
      "'appDataFolder' in parents",
    fields: "files(id, name, properties)",
  });
  return list.data.files;
}
