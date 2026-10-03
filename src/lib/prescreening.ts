import fs from "fs";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
export const UPLOAD_DIR = path.join(UPLOAD_ROOT, "documents");

// Ensure upload directory exists on server
export function ensureUploadDir() {
  if (!fs.existsSync(/*turbopackIgnore: true*/ UPLOAD_DIR)) {
    fs.mkdirSync(/*turbopackIgnore: true*/ UPLOAD_DIR, { recursive: true });
  }
}

export * from "./prescreening-rules";
