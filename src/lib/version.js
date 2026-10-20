const RELEASE_URL = "https://api.github.com/repos/Code-Amadeus/Amadeus/releases/latest";
const SEMVER = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

async function fetchLatestRelease() {
  const headers = { Accept: "application/vnd.github+json" };
  // Unauthenticated requests share a 60/hour limit per IP, which CI runners can exhaust.
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(RELEASE_URL, { headers });
  if (!response.ok) {
    throw new Error(`GitHub release request failed: ${response.status} ${response.statusText}`);
  }
  const release = await response.json();
  if (release.draft || typeof release.tag_name !== "string" || !SEMVER.test(release.tag_name)) {
    throw new Error("No published semver release found in Code-Amadeus/Amadeus");
  }
  return release.tag_name.replace(/^v/, "");
}

let latest;

// Memoized so the dev server does not call the API on every page render.
export function latestVersion() {
  latest ??= fetchLatestRelease().catch((error) => {
    latest = undefined;
    // A stale or missing version must not be deployed silently.
    if (process.env.CI) throw error;
    console.warn(`[version] ${error.message}; showing "dev" locally.`);
    return "dev";
  });
  return latest;
}
