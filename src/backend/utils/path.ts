import { dirname } from "path";
import { fileURLToPath } from "url";

export const filename = fileURLToPath(import.meta.url);
export const dirName = dirname(filename);