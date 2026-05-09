// HTML-escape any value before interpolating it into innerHTML.
// Returns "" for null/undefined so templates remain clean.
export function esc(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// Safe URL: only allow http(s) and relative URLs in href attributes.
export function safeUrl(url) {
  if (!url) return "";
  const trimmed = String(url).trim();
  if (/^(https?:|\/|#)/i.test(trimmed)) return esc(trimmed);
  return "";
}

// Safe identifier (already validated server-side, but defense in depth).
// Used wherever an id is interpolated into a CSS class name.
export function safeId(id) {
  return String(id || "").replace(/[^A-Za-z0-9_-]/g, "");
}

export async function api(path, opts = {}) {
  const r = await fetch(path, opts);
  if (!r.ok) {
    const text = await r.text().catch(() => r.statusText);
    try { throw new Error(JSON.parse(text).error || text); }
    catch { throw new Error(text); }
  }
  return r.json();
}

export function showToast(msg, error = false) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.className = "toast show" + (error ? " error" : "");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.className = "toast", 3500);
}
