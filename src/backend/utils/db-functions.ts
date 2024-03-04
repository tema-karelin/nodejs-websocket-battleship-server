import { createReadStream } from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dbI } from "../models/types-users-db";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const dbFilePath: string = path.join(dirname, "../../../db", "db.json");

export const readDb = async (): Promise<dbI> => {
  return new Promise((res, rej) => {
    const stream = createReadStream(dbFilePath, "utf-8");

    let dbFile: string = "";

    stream.on("data", (data: string) => {
      dbFile += data;
    });
    stream.on("end", () => {
      stream.destroy();
    });
    stream.on("close", () => {
      try {
        const result = JSON.parse(dbFile);
        res(result);
      } catch (error) {
        rej(error);
      }
    });
    stream.on("error", (err: Error) => {
      rej(err);
    });
  });
};


  export const create = async (jsonDb: dbI) => {

    const dbString = JSON.stringify(jsonDb);

    const addFile = new Promise((resolve, reject) => {
      writeFile(dbFilePath, dbString, { encoding: "utf-8", flag: "w" })
        .then(() => resolve("ok"))
        .catch((err) => {
          reject(err);
        });
    });
    await addFile.catch((err: Error) => {
      console.error(err.message)
    });
  };
