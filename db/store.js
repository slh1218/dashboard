// JSON-file-backed data store. No native compilation required.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { FRAMEWORKS, INDICATORS, MAPPINGS, RECOMMENDATIONS, SAMPLE_PERFORMANCE } from "./seed-data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");

function filePath(name) { return path.join(DATA_DIR, `${name}.json`); }

function load(name) {
  try { return JSON.parse(fs.readFileSync(filePath(name), "utf8")); }
  catch { return null; }
}

function save(name, data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2));
}

// Initialize store from seed data if not already on disk
export function initialize() {
  if (!load("frameworks"))    save("frameworks",   FRAMEWORKS);
  if (!load("indicators"))    save("indicators",   INDICATORS);
  if (!load("mappings"))      save("mappings",     MAPPINGS);
  if (!load("recommendations")) save("recommendations", RECOMMENDATIONS);
  if (!load("performance"))   save("performance",  SAMPLE_PERFORMANCE);
  console.log("Store initialized from", DATA_DIR);
}

// ── Indicators ────────────────────────────────────────────────────────────────
export const indicators = {
  all() { return load("indicators") || []; },
  byId(id) { return this.all().find(i => i.id === id) || null; },
};

// ── Frameworks ────────────────────────────────────────────────────────────────
export const frameworks = {
  all() { return load("frameworks") || []; },
  byId(id) { return this.all().find(f => f.id === id) || null; },
  add(fw) {
    const list = this.all();
    if (list.find(f => f.id === fw.id)) throw new Error(`Framework ${fw.id} already exists`);
    list.push(fw);
    save("frameworks", list);
    return fw;
  },
  update(id, patch) {
    const list = this.all();
    const idx = list.findIndex(f => f.id === id);
    if (idx === -1) throw new Error(`Framework ${id} not found`);
    list[idx] = { ...list[idx], ...patch };
    save("frameworks", list);
    return list[idx];
  },
};

// ── Mappings (crosswalk) ──────────────────────────────────────────────────────
export const mappings = {
  all() { return load("mappings") || []; },
  forIndicator(dsId) { return this.all().filter(m => m.dsIndicatorId === dsId); },
  forFramework(fwId) { return this.all().filter(m => m.frameworkId === fwId); },
  needingReview() { return this.all().filter(m => m.needsReview); },
  upsert(row) {
    const list = this.all();
    const idx = list.findIndex(m => m.dsIndicatorId === row.dsIndicatorId && m.frameworkId === row.frameworkId);
    if (idx >= 0) list[idx] = { ...list[idx], ...row };
    else list.push(row);
    save("mappings", list);
  },
  bulkUpsert(rows) { rows.forEach(r => this.upsert(r)); },
};

// ── Performance ───────────────────────────────────────────────────────────────
export const performance = {
  all() { return load("performance") || []; },
  add(rec) {
    const list = this.all();
    list.push(rec);
    save("performance", list);
    return rec;
  },
  query({ schoolId, gradeBand, frameworkId, dsIndicatorId } = {}) {
    let rows = this.all();
    if (schoolId)     rows = rows.filter(r => r.schoolId === schoolId);
    if (gradeBand)    rows = rows.filter(r => r.gradeBand === gradeBand);
    if (dsIndicatorId) rows = rows.filter(r => r.dsIndicatorId === dsIndicatorId);
    if (frameworkId) {
      const fwDsIds = new Set(mappings.forFramework(frameworkId).map(m => m.dsIndicatorId));
      rows = rows.filter(r => fwDsIds.has(r.dsIndicatorId));
    }
    return rows;
  },
  // Returns { strengths: [...], growth: [...] } for a school
  summary(schoolId) {
    const rows = this.query({ schoolId });
    const strengths = rows.filter(r => r.level === "high");
    const growth    = rows.filter(r => r.level === "low");
    return { strengths, growth };
  },
};

// ── Recommendations ───────────────────────────────────────────────────────────
export const recommendations = {
  all() { return load("recommendations") || []; },
  forIndicator(dsId) { return this.all().filter(r => r.dsIndicatorId === dsId); },
  add(rec) {
    const list = this.all();
    list.push(rec);
    save("recommendations", list);
    return rec;
  },
  update(id, patch) {
    const list = this.all();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) throw new Error(`Recommendation ${id} not found`);
    list[idx] = { ...list[idx], ...patch };
    save("recommendations", list);
    return list[idx];
  },
};
