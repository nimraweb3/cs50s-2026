// Core "CS" logic for SkillMatch: turning free-text job descriptions into
// a structured set of skills, and diffing that set against skills the user
// already has. Deliberately simple (keyword matching over sets, not ML) so
// it's easy to read, test, and explain in the README.

// Master vocabulary: skill name -> list of substrings that indicate the
// skill is mentioned in a job description. Extend this dictionary as you
// come across new terms in real job postings.
export const SKILL_KEYWORDS: Record<string, string[]> = {
  react: ["react", "react.js", "reactjs"],
  typescript: ["typescript", "tsx"],
  javascript: ["javascript", "es6", "ecmascript"],
  solidity: ["solidity", "smart contract"],
  wagmi: ["wagmi", "wallet connect", "walletconnect"],
  node: ["node.js", "nodejs", "express"],
  rust: ["rust", "anchor"],
  sql: ["sql", "postgres", "mysql", "sqlite"],
  python: ["python", "django"],
  flask: ["flask"],
  foundry: ["foundry", "forge", "anvil", "cast"],
  hardhat: ["hardhat"],
  "next.js": ["next.js", "nextjs"],
  tailwind: ["tailwind"],
  docker: ["docker", "containerized", "containerization"],
  aws: ["aws", "amazon web services", "ec2", "s3"],
  git: ["git ", "github", "version control"],
  graphql: ["graphql"],
};

/**
 * Scan a job description's raw text and return the set of skill names
 * (from SKILL_KEYWORDS) that appear to be required.
 */
export function extractSkills(jdText: string): Set<string> {
  const text = ` ${jdText.toLowerCase()} `;
  const found = new Set<string>();
  for (const [skill, keywords] of Object.entries(SKILL_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      found.add(skill);
    }
  }
  return found;
}

/**
 * Given the skills a job requires and the skills the user already has,
 * return the skills required by the job that the user does NOT have.
 */
export function skillGap(required: Set<string>, owned: Set<string>): string[] {
  return [...required].filter((s) => !owned.has(s));
}

/**
 * Given the skills a job requires and the skills the user already has,
 * return the skills required by the job that the user DOES have.
 */
export function matchedSkills(required: Set<string>, owned: Set<string>): string[] {
  return [...required].filter((s) => owned.has(s));
}
