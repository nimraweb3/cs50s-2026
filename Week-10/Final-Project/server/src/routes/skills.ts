import { Router, Request, Response } from "express";
import db from "../db";

const router = Router();

// GET /api/skills — the master skill vocabulary
router.get("/skills", (_req: Request, res: Response) => {
  const rows = db.prepare(`SELECT * FROM skills ORDER BY name`).all();
  res.json(rows);
});

// GET /api/user-skills — skills the user has said they already know
router.get("/user-skills", (_req: Request, res: Response) => {
  const rows = db
    .prepare(
      `SELECT s.id, s.name FROM user_skills us
        JOIN skills s ON s.id = us.skill_id
       ORDER BY s.name`
    )
    .all();
  res.json(rows);
});

// POST /api/user-skills — add a skill to the user's profile { skillId }
router.post("/user-skills", (req: Request, res: Response) => {
  const { skillId } = req.body ?? {};
  if (!skillId) return res.status(400).json({ error: "skillId is required" });

  try {
    db.prepare(`INSERT OR IGNORE INTO user_skills (skill_id) VALUES (?)`).run(skillId);
    res.status(201).json({ skillId });
  } catch (err) {
    res.status(400).json({ error: "invalid skillId" });
  }
});

// DELETE /api/user-skills/:skillId — remove a skill from the user's profile
router.delete("/user-skills/:skillId", (req: Request, res: Response) => {
  const skillId = Number(req.params.skillId);
  const result = db.prepare(`DELETE FROM user_skills WHERE skill_id = ?`).run(skillId);
  if (result.changes === 0) return res.status(404).json({ error: "not found" });
  res.status(204).send();
});

export default router;
