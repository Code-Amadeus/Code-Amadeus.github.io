const CATEGORIES = new Set(["voice", "art"]);
const VISUALS = new Set(["asr", "voice", "character", "scene", "portrait", "experimental"]);
const MIRRORS = ["baidu", "quark", "mega", "google"];

export function validateResources(resources) {
  const seen = new Set();
  for (const resource of resources) {
    const id = resource.id;
    if (!id || seen.has(id)) {
      throw new Error(`Missing or duplicate resource id: ${id}`);
    }
    seen.add(id);
    if (!CATEGORIES.has(resource.category)) {
      throw new Error(`Unknown category for ${id}`);
    }
    if (!VISUALS.has(resource.visual)) {
      throw new Error(`Unknown visual for ${id}`);
    }
    for (const field of ["title", "description", "detail"]) {
      for (const language of ["zh", "en"]) {
        const text = resource[field]?.[language];
        if (typeof text !== "string" || !text.trim()) {
          throw new Error(`Missing ${field}/${language} for ${id}`);
        }
      }
    }
    const providers = Object.keys(resource.mirrors ?? {});
    if (providers.length !== MIRRORS.length || !MIRRORS.every((name) => providers.includes(name))) {
      throw new Error(`Expected four cloud storage entries for ${id}`);
    }
    for (const [provider, mirror] of Object.entries(resource.mirrors)) {
      if (mirror === null) {
        continue;
      }
      let url;
      try {
        url = new URL(mirror.url);
      } catch {
        throw new Error(`Expected an HTTPS share URL: ${id}/${provider}`);
      }
      if (url.protocol !== "https:" || !url.host || url.username || url.password) {
        throw new Error(`Expected an HTTPS share URL: ${id}/${provider}`);
      }
      for (const field of ["code", "archive_password"]) {
        if (field in mirror && typeof mirror[field] !== "string") {
          throw new Error(`${field} must be text: ${id}/${provider}`);
        }
      }
    }
  }
  return resources;
}

// Escape '<' so authored JSON cannot close its script element.
export function serializeResources(resources) {
  return JSON.stringify(resources).replace(/</g, "\\u003c");
}
