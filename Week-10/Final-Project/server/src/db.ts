import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";
import { SKILL_KEYWORDS } from "./helpers";

// Using Node's built-in node:sqlite (stable since Node 24) instead of the
// better-sqlite3 package. This avoids native module compilation entirely —
// no Visual Studio Build Tools / node-gyp needed on Windows, no prebuilt
// binary matching needed on any platform. Requires Node.js 22.5+.
const dbPath = path.join(__dirname, "..", "database.db");
const db = new DatabaseSync(dbPath);
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

// Initialize schema on first run / whenever tables are missing.
const schemaPath = path.join(__dirname, "..", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");
db.exec(schema);

// Seed the master skills list from the same keyword dictionary the matcher
// uses, so every skill the algorithm can detect is selectable in the UI.
const insertSkill = db.prepare("INSERT OR IGNORE INTO skills (name) VALUES (?)");
for (const name of Object.keys(SKILL_KEYWORDS)) {
  insertSkill.run(name);
}

export default db;
