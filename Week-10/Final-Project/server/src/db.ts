import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { SKILL_KEYWORDS } from "./helpers";

const dbPath = path.join(__dirname, "..", "database.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Initialize schema on first run / whenever tables are missing.
const schemaPath = path.join(__dirname, "..", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");
db.exec(schema);

// Seed the master skills list from the same keyword dictionary the matcher
// uses, so every skill the algorithm can detect is selectable in the UI.
const insertSkill = db.prepare("INSERT OR IGNORE INTO skills (name) VALUES (?)");
const seedSkills = db.transaction((names: string[]) => {
  for (const name of names) insertSkill.run(name);
});
seedSkills(Object.keys(SKILL_KEYWORDS));

export default db;
