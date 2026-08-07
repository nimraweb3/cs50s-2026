import { Router, Request, Response } from "express";
import db from "../db";
import { DashboardRow } from "../types";

const router = Router();

// GET /api/dashboard — across all applications, which required skills does
// the user NOT have, ranked by how often they show up. This is the "what
// should I learn next" view, driven entirely by the user's real pipeline.
router.get("/", (_req: Request, res: Response) => {
  const rows = db
    .prepare(
      `SELECT s.name AS name, COUNT(*) AS missing_count
         FROM application_skills aps
         JOIN skills s ON s.id = aps.skill_id
        WHERE s.id NOT IN (SELECT skill_id FROM user_skills)
        GROUP BY s.name
        ORDER BY missing_count DESC`
    )
    .all() as unknown as DashboardRow[];

  const totals = db.prepare(`SELECT COUNT(*) AS total FROM applications`).get() as {
    total: number;
  };

  res.json({ missingSkills: rows, totalApplications: totals.total });
});

export default router;
