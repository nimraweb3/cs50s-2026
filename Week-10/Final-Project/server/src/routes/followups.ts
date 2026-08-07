import { Router, Request, Response } from "express";
import db from "../db";

const router = Router();

// GET /api/followups — applications with no status change in 7+ days that
// aren't already resolved (offer/rejected). Simple date-diff logic, no
// separate reminder scheduling needed for this scope.
router.get("/", (_req: Request, res: Response) => {
  const rows = db
    .prepare(
      `SELECT id, company, role, status, last_status_change,
              CAST(julianday('now') - julianday(last_status_change) AS INTEGER) AS days_since_update
         FROM applications
        WHERE status NOT IN ('offer', 'rejected')
          AND julianday('now') - julianday(last_status_change) >= 7
        ORDER BY days_since_update DESC`
    )
    .all();
  res.json(rows);
});

export default router;
