CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    jd_text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'applied',
    date_applied TEXT NOT NULL DEFAULT (date('now')),
    last_status_change TEXT NOT NULL DEFAULT (date('now'))
);

CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    skill_id INTEGER NOT NULL REFERENCES skills(id),
    UNIQUE(skill_id)
);

CREATE TABLE IF NOT EXISTS application_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL REFERENCES applications(id),
    skill_id INTEGER NOT NULL REFERENCES skills(id),
    UNIQUE(application_id, skill_id)
);

CREATE TABLE IF NOT EXISTS followups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL REFERENCES applications(id),
    remind_on TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
);
