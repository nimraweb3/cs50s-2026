import { useEffect, useState } from "react";
import { addUserSkill, getSkills, getUserSkills, removeUserSkill } from "../api";
import { Skill } from "../types";

export default function Profile() {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    Promise.all([getSkills(), getUserSkills()])
      .then(([all, mine]) => {
        setAllSkills(all);
        setUserSkills(mine);
      })
      .catch((e) => setError(e.message));
  }

  useEffect(refresh, []);

  const ownedIds = new Set(userSkills.map((s) => s.id));

  async function toggle(skill: Skill) {
    try {
      if (ownedIds.has(skill.id)) {
        await removeUserSkill(skill.id);
      } else {
        await addUserSkill(skill.id);
      }
      refresh();
    } catch (e: any) {
      setError(e.message);
    }
  }

  if (error) return <div className="card">Error: {error}</div>;

  return (
    <div>
      <h1>My skills</h1>
      <div className="card">
        <div className="muted" style={{ marginBottom: 14 }}>
          Tap a skill to mark it as one you already have. This is what every application gets diffed
          against.
        </div>
        {allSkills.map((skill) => (
          <button
            key={skill.id}
            className={`skill-chip-btn ${ownedIds.has(skill.id) ? "owned" : ""}`}
            onClick={() => toggle(skill)}
          >
            {ownedIds.has(skill.id) ? "✓ " : ""}
            {skill.name}
          </button>
        ))}
      </div>
    </div>
  );
}
