import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApplications, getFollowups } from "../api";
import { ApplicationWithGap, Followup } from "../types";

export default function Applications() {
  const [applications, setApplications] = useState<ApplicationWithGap[] | null>(null);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getApplications(), getFollowups()])
      .then(([apps, fups]) => {
        setApplications(apps);
        setFollowups(fups);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="card">Error: {error}</div>;
  if (!applications) return <div className="muted">Loading...</div>;

  return (
    <div>
      <h1>Applications</h1>

      {followups.length > 0 && (
        <div className="card" style={{ borderColor: "#e2a53c" }}>
          <h2>Needs a follow-up</h2>
          {followups.map((f) => (
            <div key={f.id} className="row" style={{ marginBottom: 6 }}>
              <span>
                {f.company} — {f.role}
              </span>
              <span className="muted">{f.days_since_update} days since last update</span>
            </div>
          ))}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="card empty-state">
          No applications logged yet. <Link className="link" to="/add">Add your first one</Link>.
        </div>
      ) : (
        applications.map((app) => (
          <Link key={app.id} to={`/applications/${app.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="card">
              <div className="row">
                <div>
                  <strong>{app.company}</strong>
                  <div className="muted">{app.role}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={`pill pill-${app.status}`}>{app.status}</span>
                  <div className="muted" style={{ marginTop: 6 }}>
                    {app.missing_skills_count} skill{app.missing_skills_count === 1 ? "" : "s"} missing
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
