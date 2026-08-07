import express from "express";
import cors from "cors";
import applicationsRouter from "./routes/applications";
import skillsRouter from "./routes/skills";
import dashboardRouter from "./routes/dashboard";
import followupsRouter from "./routes/followups";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/applications", applicationsRouter);
app.use("/api", skillsRouter); // exposes /api/skills, /api/user-skills
app.use("/api/dashboard", dashboardRouter);
app.use("/api/followups", followupsRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`SkillMatch API listening on http://localhost:${PORT}`);
});
