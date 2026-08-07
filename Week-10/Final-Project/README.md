# SkillMatch

#### Video Demo: TODO — add your YouTube URL here after recording

#### Description:

SkillMatch is a full-stack web application for tracking job and internship applications with one feature that sets it apart from a plain spreadsheet or a typical "job tracker" app: it automatically reads the text of every job description you paste in, detects which technical skills it's asking for, and compares that list against a profile of the skills you already have. Instead of just organizing applications by status, it tells you exactly which skills are missing for each individual role, and — more usefully — which skills come up most often across your *entire* pipeline that you don't yet have. That second number is the actual "what should I learn next" signal, derived from real job postings you're applying to rather than a generic list someone else compiled.

I built this because I'm an active blockchain/Web3 developer applying to roles that mix React, TypeScript, Solidity, and various tooling, and I had already been doing this comparison manually — reading a job description and mentally noting "I don't know Wagmi yet" or "this one wants Rust." SkillMatch automates that process and keeps a running history of it.

## Why this architecture

The project is split into two halves that talk over a JSON API: `server/`, a Node.js and Express backend written in TypeScript, and `client/`, a React and TypeScript frontend built with Vite. I chose a full TypeScript stack over Python/Flask, which CS50 teaches directly, because I already work daily in TypeScript across other projects and wanted the backend logic — the actual computer science of this project — to be the thing I spent my time on, rather than relearning a templating language. The project still draws directly on CS50's lessons: Week 7's relational database and SQL design, Week 9's concept of routes and request/response cycles (here implemented in Express instead of Flask), and Week 8's JavaScript, extended into TypeScript and React on the frontend.

The two halves communicate entirely through a small JSON API under `/api`. During development, Vite's dev server proxies any request to `/api/*` straight through to the Express server on a different port, which avoids configuring CORS by hand and keeps the client code free of hardcoded URLs.

## Why SQLite with raw SQL, not an ORM

I use SQLite directly via Node's built-in `node:sqlite` module (stable as of Node 22.5+), rather than an ORM like Prisma or TypeORM, and rather than a third-party driver package. Two reasons: an ORM would have hidden the actual SQL behind generated code, and the querying skill from CS50's SQL week is exactly what I wanted this project to demonstrate — every query in `server/src/routes/` is hand-written SQL. Using the built-in module instead of `better-sqlite3` also means no native code ever needs to compile on install — `better-sqlite3` requires a C++ toolchain (Visual Studio Build Tools on Windows) to build from source when no prebuilt binary matches your platform/Node version, which is exactly the kind of setup friction a grader running `submit50` shouldn't have to deal with. `node:sqlite` ships with Node itself, so `npm install` never touches a compiler.

The dashboard's aggregate query is the most interesting one in the project:

```sql
SELECT s.name, COUNT(*) AS missing_count
FROM application_skills aps
JOIN skills s ON s.id = aps.skill_id
WHERE s.id NOT IN (SELECT skill_id FROM user_skills)
GROUP BY s.name
ORDER BY missing_count DESC;
```

This single query is what powers the "what to learn next" bar chart — for every skill mentioned across every job description I've logged, it counts how many times that skill appears in applications where I don't already have it, and ranks them. It's a subquery plus a join plus a group-by, which is a fair test of the SQL concepts the course covers.

## Database design

There are five tables, defined in `server/schema.sql`:

- **applications** — one row per job/internship application: company, role, the full raw job description text, a status (`applied`, `oa`, `interview`, `offer`, `rejected`), and two dates (when applied, and when the status last changed).
- **skills** — a master vocabulary of skill names (react, typescript, solidity, sql, and so on). This table is seeded automatically on first run from the same dictionary the matching algorithm uses, so every skill the algorithm can ever detect is also selectable in the UI.
- **user_skills** — a join table recording which skills from the master list the user has said they already know. This is the "profile" side of the diff.
- **application_skills** — a join table recording which skills from the master list were detected in a given application's job description text. This is the "requirement" side of the diff.
- **followups** — reserved for a possible future feature (scheduled reminders); the current follow-up logic instead computes staleness directly from `applications.last_status_change`, so this table exists but isn't actively written to yet.

Keeping "skills a job requires" and "skills the user has" as two separate join tables against one shared vocabulary, rather than storing skill names as free text in either table, is what makes the diffing operation a simple set operation instead of a string-matching problem every time it runs.

## The matching algorithm

The core logic lives in `server/src/helpers.ts` and is intentionally simple: a dictionary maps each skill name to a list of substrings that indicate it's mentioned (for example, `typescript` matches on `"typescript"` or `"tsx"`). `extractSkills` lowercases a job description's text and checks each skill's keyword list against it, returning a `Set` of matched skill names. `skillGap` and `matchedSkills` then do set differencing and set intersection respectively between the required skills and the skills the user already owns.

I chose keyword matching over a proper NLP or ML-based approach on purpose. It's transparent — you can read the dictionary and know exactly why a skill was or wasn't detected — and it's trivially testable, which is why `server/src/helpers.test.ts` exists as a standalone test file with no framework dependency, checking the algorithm's behavior against a handful of realistic job description snippets before it's ever wired into a route. A natural extension, noted here rather than built, would be swapping the keyword dictionary for a real NLP library if the project needed to handle skills phrased in ways the dictionary doesn't anticipate.

## Routes and pages

The Express server exposes REST-style JSON endpoints under `/api` for applications, skills, user skills, the dashboard aggregate, and follow-ups (full list and behavior documented in code comments in `server/src/routes/`). The React frontend has five pages under `client/src/pages/`: **Applications** (the main list, with a missing-skill count per row and a follow-up banner for stale applications), **AddApplication** (a form that shows the matched and missing skills immediately after saving), **ApplicationDetail** (full job description text alongside matched/missing skill tags and a status dropdown), **Dashboard** (the bar chart described above), and **Profile** (a simple tap-to-toggle list for managing which skills you currently have).

## Running it

Requires Node.js 22.5 or newer (for `node:sqlite`). From the project root: `npm run install:all` once, then `npm run dev`, which starts the Express server on port 4000 and the Vite dev server on port 5173 together. Open `http://localhost:5173`. The SQLite database file is created automatically on first run, with the skills table pre-seeded — no manual setup required. You may see a one-line "SQLite is an experimental feature" warning in the server log; that's expected and harmless, it doesn't affect functionality.

## What I'd add next

Authentication (currently the app assumes a single local user, which is reasonable for a personal tool but wouldn't scale to multiple people sharing one deployment), a way to edit or delete a logged application, and expanding the skill-keyword dictionary based on real job postings as I keep using it for my own applications.
