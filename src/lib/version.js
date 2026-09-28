const TAGS_URL = "https://api.github.com/repos/Code-Amadeus/Amadeus/tags?per_page=100";
const SEMVER = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

function parse(tag) {
  const match = SEMVER.exec(tag);
  if (!match) return null;
  return {
    tag,
    core: match.slice(1, 4).map(Number),
    pre: match[4] ? match[4].split(".") : [],
  };
}

// Semver precedence: a release outranks its prereleases; numeric identifiers compare numerically.
function compare(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a.core[i] !== b.core[i]) return a.core[i] - b.core[i];
  }
  if (!a.pre.length || !b.pre.length) return b.pre.length - a.pre.length;
  for (let i = 0; i < Math.max(a.pre.length, b.pre.length); i++) {
    const x = a.pre[i];
    const y = b.pre[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    if (x === y) continue;
    const xNum = /^\d+$/.test(x);
    const yNum = /^\d+$/.test(y);
    if (xNum && yNum) return Number(x) - Number(y);
    if (xNum !== yNum) return xNum ? -1 : 1;
    return x < y ? -1 : 1;
  }
  return 0;
}

async function fetchLatestTag() {
  const headers = { Accept: "application/vnd.github+json" };
  // Unauthenticated requests share a 60/hour limit per IP, which CI runners can exhaust.
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(TAGS_URL, { headers });
  if (!response.ok) {
    throw new Error(`GitHub tags request failed: ${response.status} ${response.statusText}`);
  }
  const versions = (await response.json()).map((item) => parse(item.name)).filter(Boolean);
  if (!versions.length) throw new Error("No semver tags found in Code-Amadeus/Amadeus");
  return versions.sort(compare).at(-1).tag.replace(/^v/, "");
}

let latest;

// Memoized so the dev server does not call the API on every page render.
export function latestVersion() {
  latest ??= fetchLatestTag().catch((error) => {
    latest = undefined;
    // A stale or missing version must not be deployed silently.
    if (process.env.CI) throw error;
    console.warn(`[version] ${error.message}; showing "dev" locally.`);
    return "dev";
  });
  return latest;
}
