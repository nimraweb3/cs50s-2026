import { Router, Request, Response } from "express";
import db from "../db";
import { extractSkills, skillGap, matchedSkills } from "../helpers";
import { ApplicationDetail, ApplicationWithGap, Status } from "../types";

const router = Router();

const VALID_STATUSES: Status[] = ["applied", "oa", "interview", "offer", "rejected"];

// GET /api/applications — list all applications with a missing-skill count
router.get("/", (_req: Request, res: Response) => {
  const rows = db
    .prepare(
      `SELECT a.*,
              (SELECT COUNT(*) FROM application_skills aps
                WHERE aps.application_id = a.id
                  AND aps.skill_id NOT IN (SELECT skill_id FROM user_skills)
              ) AS missing_skills_count
         FROM applications a
        ORDER BY a.date_applied DESC, a.id DESC`
    )
    .all() as ApplicationWithGap[];
  res.json(rows);
});

// POST /api/applications — create an application, run the skill matcher
router.post("/", (req: Request, res: Response) => {
  const { company, role, jdText } = req.body ?? {};
  if (!company || !role || !jdText) {
    return res.status(400).json({ error: "company, role, and jdText are required" });
  }

  const required = extractSkills(jdText);

  const insertApplication = db.prepare(
    `INSERT INTO applications (company, role, jd_text) VALUES (?, ?, ?)`
  );
  const info = insertApplication.run(company, role, jdText);
  const applicationId = info.lastInsertRowid as number;

  const findSkillId = db.prepare(`SELECT id FROM skills WHERE name = ?`);
  const linkSkill = db.prepare(
    `INSERT OR IGNORE INTO application_skills (application_id, skill_id) VALUES (?, ?)`
  );
  const linkAll = db.transaction((skillNames: string[]) => {
    for (const name of skillNames) {
      const row = findSkillId.get(name) as { id: number } | undefined;
      if (row) linkSkill.run(applicationId, row.id);
    }
  });
  linkAll([...required]);

  const ownedRows = db
    .prepare(
      `SELECT s.name FROM user_skills us JOIN skills s ON s.id = us.skill_id`
    )
    .all() as { name: string }[];
  const owned = new Set(ownedRows.map((r) => r.name));

  res.status(201).json({
    id: applicationId,
    requiredSkills: [...required],
    matchedSkills: matchedSkills(required, owned),
    missingSkills: skillGap(required, owned),
  });
});

// GET /api/applications/:id — full detail with matched/missing skills
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const application = db.prepare(`SELECT * FROM applications WHERE id = ?`).get(id);
  if (!application) return res.status(404).json({ error: "not found" });

  const requiredRows = db
    .prepare(
      `SELECT s.name FROM application_skills aps
        JOIN skills s ON s.id = aps.skill_id
       WHERE aps.application_id = ?`
    )
    .all(id) as { name: string }[];
  const required = new Set(requiredRows.map((r) => r.name));

  const ownedRows = db
    .prepare(`SELECT s.name FROM user_skills us JOIN skills s ON s.id = us.skill_id`)
    .all() as { name: string }[];
  const owned = new Set(ownedRows.map((r) => r.name));

  const detail: ApplicationDetail = {
    ...(application as any),
    matched_skills: matchedSkills(required, owned),
    missing_skills: skillGap(required, owned),
  };

  res.json(detail);
});

// PATCH /api/applications/:id/status — move an application through the pipeline
router.patch("/:id/status", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body ?? {};
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${VALID_STATUSES.join(", ")}` });
  }

  const result = db
    .prepare(
      `UPDATE applications
          SET status = ?, last_status_change = date('now')
        WHERE id = ?`
    )
    .run(status, id);

  if (result.changes === 0) return res.status(404).json({ error: "not found" });
  res.json({ id, status });
});

export default router;
