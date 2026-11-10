import { execSync } from "node:child_process";

const repo = process.env.GITHUB_MIRROR || "yaroshidi/yugc";
const branch = process.env.GITHUB_MIRROR_BRANCH || "main";

const localLines = execSync("git ls-tree -r HEAD", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean);

const local = new Map(
  localLines.map((line) => {
    const [meta, path] = line.split("\t");
    const sha = meta.split(" ")[2];
    return [path, sha];
  }),
);

const response = await fetch(
  `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`,
  {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "yugc-mirror",
    },
  },
);

if (!response.ok) {
  console.error(`GitHub tree request failed (${response.status})`);
  process.exit(1);
}

const data = await response.json();
if (data.truncated) {
  console.error("GitHub returned a truncated tree");
  process.exit(1);
}

const remote = new Map(
  data.tree.filter((entry) => entry.type === "blob").map((entry) => [entry.path, entry.sha]),
);

const differences = [];
for (const [path, sha] of local) {
  if (remote.get(path) !== sha) differences.push(`differ ${path}`);
}
for (const path of remote.keys()) {
  if (!local.has(path)) differences.push(`only on github ${path}`);
}

if (differences.length) {
  for (const line of differences) console.error(line);
  console.error(`${differences.length} differences. ${repo}@${branch} is not this tree.`);
  process.exit(1);
}

console.log(`${repo}@${branch} matches this tree (${local.size} files)`);
