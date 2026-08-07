import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addApplication } from "../api";

export default function AddApplication() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState<{ matchedSkills: string[]; missingSkills: string[] } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await addApplication({ company, role, jdText });
      setResult({ matchedSkills: res.matchedSkills, missingSkills: res.missingSkills });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Add an application</h1>

      <form className="card" onSubmit={handleSubmit}>
        <label htmlFor="company">Company</label>
        <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />

        <label htmlFor="role">Role</label>
        <input id="role" value={role} onChange={(e) => setRole(e.target.value)} required />

        <label htmlFor="jd">Job description</label>
        <textarea
          id="jd"
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the full job description text here..."
          required
        />

        {error && <div style={{ color: "#f0928a", marginBottom: 12 }}>{error}</div>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save application"}
        </button>
      </form>

      {result && (
        <div className="card">
          <h2>Skill match, right away</h2>
          <div className="muted" style={{ marginBottom: 10 }}>
            Matched skills
          </div>
          {result.matchedSkills.length === 0 ? (
            <div className="muted">None matched.</div>
          ) : (
            result.matchedSkills.map((s) => (
              <span key={s} className="tag tag-owned">
                {s}
              </span>
            ))
          )}
          <div className="muted" style={{ margin: "14px 0 10px" }}>
            Missing skills
          </div>
          {result.missingSkills.length === 0 ? (
            <div className="muted">None missing — you're fully covered for this one.</div>
          ) : (
            result.missingSkills.map((s) => (
              <span key={s} className="tag tag-missing">
                {s}
              </span>
            ))
          )}
          <div style={{ marginTop: 16 }}>
            <button className="secondary" onClick={() => navigate("/")}>
              View all applications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
