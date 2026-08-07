import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getDashboard } from "../api";
import { DashboardResponse } from "../types";

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="card">Error: {error}</div>;
  if (!data) return <div className="muted">Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="card">
        <div className="muted">Total applications logged</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{data.totalApplications}</div>
      </div>

      <div className="card">
        <h2>What to learn next</h2>
        <div className="muted" style={{ marginBottom: 14 }}>
          Skills that show up most often across your applications, that you don't have yet.
        </div>

        {data.missingSkills.length === 0 ? (
          <div className="muted">
            No skill gaps found — either you're fully covered, or you haven't logged any applications
            yet.
          </div>
        ) : (
          <div style={{ width: "100%", height: Math.max(200, data.missingSkills.length * 40) }}>
            <ResponsiveContainer>
              <BarChart data={data.missingSkills} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" horizontal={false} />
                <XAxis type="number" allowDecimals={false} stroke="#9aa1ad" />
                <YAxis type="category" dataKey="name" width={90} stroke="#9aa1ad" />
                <Tooltip
                  contentStyle={{ background: "#1f232c", border: "1px solid #2a2f3a", color: "#e7e9ee" }}
                />
                <Bar dataKey="missing_count" fill="#5b8def" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
