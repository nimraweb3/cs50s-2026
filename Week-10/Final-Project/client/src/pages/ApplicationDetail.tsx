import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getApplication, updateStatus } from "../api";
import { ApplicationDetail as ApplicationDetailType, Status } from "../types";

const STATUSES: Status[] = ["applied", "oa", "interview", "offer", "rejected"];

export default function ApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState<ApplicationDetailType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getApplication(Number(id))
      .then(setApplication)
      .catch((e) => setError(e.message));
  }, [id]);

  async function handleStatusChange(status: Status) {
    if (!application) return;
    setSaving(true);
    try {
      await updateStatus(application.id, status);
      setApplication({ ...application, status });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (error) return <div className="card">Error: {error}</div>;
  if (!application) return <div className="muted">Loading...</div>;

  return (
    <div>
      <Link className="link" to="/">
        ← back to applications
      </Link>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="row">
          <div>
            <h1 style={{ marginBottom: 4 }}>{application.company}</h1>
            <div className="muted">{application.role}</div>
          </div>
          <select
            value={application.status}
            disabled={saving}
            onChange={(e) => handleStatusChange(e.target.value as Status)}
            style={{ width: 160, marginBottom: 0 }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="muted" style={{ marginTop: 10 }}>
          Applied {application.date_applied} · last updated {application.last_status_change}
        </div>
      </div>

      <div className="card">
        <h2>Skills matched ({application.matched_skills.length})</h2>
        {application.matched_skills.length === 0 ? (
          <div className="muted">None of your current skills matched this JD.</div>
        ) : (
          application.matched_skills.map((s) => (
            <span key={s} className="tag tag-owned">
              {s}
            </span>
          ))
        )}
      </div>

      <div className="card">
        <h2>Skills missing ({application.missing_skills.length})</h2>
        {application.missing_skills.length === 0 ? (
          <div className="muted">You already have every skill this JD asks for.</div>
        ) : (
          application.missing_skills.map((s) => (
            <span key={s} className="tag tag-missing">
              {s}
            </span>
          ))
        )}
      </div>

      <div className="card">
        <h2>Job description</h2>
        <div className="muted" style={{ whiteSpace: "pre-wrap" }}>
          {application.jd_text}
        </div>
      </div>
    </div>
  );
}
