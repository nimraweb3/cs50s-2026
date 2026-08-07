// Minimal standalone test runner (no test framework dependency needed for
// CS50 scope). Run with: npm test --prefix server

import { extractSkills, skillGap, matchedSkills } from "./helpers";

let passed = 0;
let failed = 0;

function assertEqual(actual: unknown, expected: unknown, label: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    console.log(`  PASS  ${label}`);
    passed++;
  } else {
    console.log(`  FAIL  ${label}\n        expected: ${e}\n        actual:   ${a}`);
    failed++;
  }
}

console.log("extractSkills");
assertEqual(
  [...extractSkills("Looking for a React and TypeScript developer, must know Solidity")].sort(),
  ["react", "solidity", "typescript"].sort(),
  "detects multiple skills from a JD"
);
assertEqual(
  [...extractSkills("We use Node.js and Express with a SQL database")].sort(),
  ["node", "sql"].sort(),
  "detects node and sql (express counts as node)"
);
assertEqual([...extractSkills("General role, no tech mentioned")], [], "returns empty set when nothing matches");

console.log("skillGap");
assertEqual(
  skillGap(new Set(["react", "solidity", "rust"]), new Set(["react"])).sort(),
  ["rust", "solidity"].sort(),
  "returns required skills the user does not have"
);
assertEqual(skillGap(new Set(["react"]), new Set(["react", "rust"])), [], "returns empty when user has everything required");

console.log("matchedSkills");
assertEqual(
  matchedSkills(new Set(["react", "solidity", "rust"]), new Set(["react", "rust"])).sort(),
  ["react", "rust"].sort(),
  "returns required skills the user already has"
);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
