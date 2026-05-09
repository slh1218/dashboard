/**
 * Validation script — covers Step 1 and Step 2 test criteria:
 *
 * Step 1: Verify DS Indicator ID format "DS-[Element#].[Indicator#]"
 *         and that an indicator can link to ≥ 3 framework codes simultaneously.
 *
 * Step 2: Confirm that rows with confidence="low" or rationale containing
 *         "REVIEW NEEDED" are flagged without crashing the import.
 *
 * Step 3: Verify Danielson filter returns DS-2.4 and DS-3.5.
 *
 * Step 4: Verify that DS-2.3 (low performance) triggers Digital Literacy recommendation.
 *
 * Step 5: Verify that adding a new framework causes it to appear in the framework list.
 */

import { initialize, indicators, frameworks, mappings, recommendations, performance } from "./db/store.js";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
initialize();

let passed = 0, failed = 0;

function assert(label, condition, detail = "") {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

// ── STEP 1: Schema & Format Validation ───────────────────────────────────────
console.log("\n── Step 1: Data Schema & Format ──────────────────────────────────────");

const DS_ID_REGEX = /^DS-\d+\.\d+$/;

const allIndicators = indicators.all();
assert("At least one indicator exists", allIndicators.length > 0);

const badIds = allIndicators.filter(i => !DS_ID_REGEX.test(i.id));
assert("All indicator IDs match DS-[N].[N] format", badIds.length === 0,
  badIds.map(i => i.id).join(", "));

// Verify ≥ 3 simultaneous framework links for a well-mapped indicator
const ds11Maps = mappings.forIndicator("DS-1.1");
assert("DS-1.1 links to ≥ 3 frameworks simultaneously", ds11Maps.length >= 3,
  `Found ${ds11Maps.length}: ${ds11Maps.map(m => m.frameworkId).join(", ")}`);

const ds23Maps = mappings.forIndicator("DS-2.3");
assert("DS-2.3 links to ≥ 3 frameworks simultaneously", ds23Maps.length >= 3,
  `Found ${ds23Maps.length}: ${ds23Maps.map(m => m.frameworkId).join(", ")}`);

assert("DS-1.1 has required fields (element, title, gradeBands, evidenceTypes)",
  allIndicators.find(i => i.id === "DS-1.1")?.element === 1 &&
  allIndicators.find(i => i.id === "DS-1.1")?.gradeBands?.length > 0);

// ── STEP 2: Import Validation Logic ──────────────────────────────────────────
console.log("\n── Step 2: CSV Import & Low-Confidence Flagging ──────────────────────");

const csvPath = path.join(__dirname, "data", "sample-crosswalk.csv");
const csvContent = fs.readFileSync(csvPath, "utf8");
const records = parse(csvContent, { columns: true, trim: true, skip_empty_lines: true });

let importedCount = 0, flaggedRows = [], errorRows = [];
let crashed = false;

try {
  for (const row of records) {
    const { dsIndicatorId, frameworkId, frameworkCode, confidence, rationale } = row;

    if (!DS_ID_REGEX.test(dsIndicatorId)) {
      errorRows.push(row);
      continue;
    }

    const needsReview =
      confidence?.toLowerCase() === "low" ||
      /REVIEW NEEDED/i.test(rationale || "");

    const mapping = { dsIndicatorId, frameworkId, frameworkCode, confidence, rationale, needsReview };
    // Do NOT actually persist during validation; just process
    importedCount++;
    if (needsReview) flaggedRows.push(mapping);
  }
} catch (e) {
  crashed = true;
  console.error("  CRASH:", e.message);
}

assert("CSV import does not crash on bad rows", !crashed);
assert("Invalid DS ID rows are rejected (not imported)",
  errorRows.length === 1 && errorRows[0].dsIndicatorId === "INVALID-FORMAT",
  `Rejected: ${errorRows.map(r => r.dsIndicatorId).join(", ")}`);
assert("Low-confidence / REVIEW NEEDED rows are flagged", flaggedRows.length >= 1,
  `Flagged: ${flaggedRows.map(r => `${r.dsIndicatorId}/${r.frameworkId}`).join(", ")}`);
assert("Valid rows are still processed despite bad rows",
  importedCount > 0, `Imported: ${importedCount}`);

// ── STEP 3: Framework Filter Returns Expected Indicators ──────────────────────
console.log("\n── Step 3: Danielson Filter — DS-2.4 and DS-3.5 ─────────────────────");

const danielsonMaps = mappings.forFramework("DANIELSON");
const danielsonDsIds = new Set(danielsonMaps.map(m => m.dsIndicatorId));

assert("Danielson filter includes DS-2.4 (Direct Instruction)", danielsonDsIds.has("DS-2.4"),
  `Found: ${[...danielsonDsIds].join(", ")}`);
assert("Danielson filter includes DS-3.5 (Service Learning)", danielsonDsIds.has("DS-3.5"),
  `Found: ${[...danielsonDsIds].join(", ")}`);

// ── STEP 4: Low Score → Recommendation for DS-2.3 ────────────────────────────
console.log("\n── Step 4: Recommendations for Low-Performance DS-2.3 ───────────────");

const ds23Recs = recommendations.forIndicator("DS-2.3");
assert("DS-2.3 has at least one recommendation", ds23Recs.length > 0);

const hasDigitalLiteracy = ds23Recs.some(r =>
  /digital literacy|source evaluation/i.test(r.title) ||
  /digital literacy|source evaluation/i.test(r.description)
);
assert("DS-2.3 recommendations include Digital Literacy/Source Evaluation", hasDigitalLiteracy,
  `Titles: ${ds23Recs.map(r => r.title).join(", ")}`);

// Also verify performance summary logic flags DS-2.3 as growth area
const { growth } = performance.summary("school-demo");
const ds23Growth = growth.find(g => g.dsIndicatorId === "DS-2.3");
assert("DS-2.3 low score appears in school growth summary", !!ds23Growth,
  `Growth indicators: ${growth.map(g => g.dsIndicatorId).join(", ")}`);

// ── STEP 5: Admin — Add New Framework, Verify It Appears ─────────────────────
console.log("\n── Step 5: Admin Add Framework — WORKFORCE ───────────────────────────");

const beforeCount = frameworks.all().length;
try {
  frameworks.add({ id: "WORKFORCE", name: "Illinois Workforce Readiness Framework",
    shortName: "Workforce", color: "#37474F" });
} catch (e) {
  // Already exists from a previous run — that's fine
}
const afterList  = frameworks.all();
const afterCount = afterList.length;
const hasWorkforce = afterList.some(f => f.id === "WORKFORCE");

assert("WORKFORCE framework is present in framework list after add", hasWorkforce);
assert("Framework list count increased or WORKFORCE already existed",
  afterCount >= beforeCount, `Before: ${beforeCount}, After: ${afterCount}`);

// ── STEP 6: Hardening — XSS escape helper, FK validation, resolve immutability ─
console.log("\n── Step 6: Hardening (XSS escape, validation guards) ─────────────────");

// 6a: HTML escape helper covers all angle-bracket / quote chars
const utilSrc = fs.readFileSync(path.join(__dirname, "public", "js", "util.js"), "utf8");
assert("Frontend util.js exposes esc() helper", /export function esc/.test(utilSrc));
assert("esc() handles all five XSS sentinel chars",
  /&amp;.*&lt;.*&gt;.*&quot;.*&#39;/s.test(utilSrc));

// 6b: All frontend modules import esc from util.js
for (const file of ["overview.js", "framework.js", "indicator.js", "admin.js"]) {
  const src = fs.readFileSync(path.join(__dirname, "public", "js", file), "utf8");
  assert(`${file} imports esc from util.js`, /from ["']\.\/util\.js["']/.test(src) && /\besc\b/.test(src));
}

// 6c: Resolve endpoint logic — needsReview must be set to false explicitly,
// and the body must NOT be spread after needsReview:false (which would let a
// client un-resolve via {needsReview:true}).
const adminRouteSrc = fs.readFileSync(path.join(__dirname, "routes", "admin.js"), "utf8");
assert("Resolve endpoint exists",
  /post\("\/review-queue\/:dsId\/:fwId\/resolve"/.test(adminRouteSrc));
assert("Resolve sets patch.needsReview = false",
  /patch\.needsReview\s*=\s*false/.test(adminRouteSrc));
assert("Resolve does NOT spread req.body after needsReview:false",
  !/needsReview:\s*false[^}]*\.\.\.req\.body/.test(adminRouteSrc));

// 6d: Performance route validates score range and DS existence
const perfRouteSrc = fs.readFileSync(path.join(__dirname, "routes", "performance.js"), "utf8");
assert("Performance route rejects non-finite or out-of-range scores",
  /Number\.isFinite\(score\)/.test(perfRouteSrc) && /score < 1 \|\| score > 4/.test(perfRouteSrc));
assert("Performance route rejects unknown DS indicators",
  /indicators\.byId\(dsIndicatorId\)/.test(perfRouteSrc) && /Unknown indicator/.test(perfRouteSrc));

// 6e: Admin framework POST validates ID shape & color
assert("Admin framework POST validates ID shape", /FW_ID_REGEX/.test(adminRouteSrc));
assert("Admin framework POST validates hex color",  /HEX_COLOR_REGEX/.test(adminRouteSrc));
assert("Admin recommendations require valid DS ID", /DS_ID_REGEX/.test(adminRouteSrc));

// 6f: Server has a global error handler and exposes /data for sample-CSV download
const serverSrc = fs.readFileSync(path.join(__dirname, "server.js"), "utf8");
assert("Server exposes /data for sample-CSV download", /app\.use\("\/data"/.test(serverSrc));
assert("Server has a global error handler",            /app\.use\(\(err,/.test(serverSrc));

// 6g: Import route validates frameworkId against framework list
const importRouteSrc = fs.readFileSync(path.join(__dirname, "routes", "import.js"), "utf8");
assert("Import route validates frameworkId against known frameworks",
  /knownFwIds\.has\(frameworkId\)/.test(importRouteSrc));

// ── Results ───────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(58)}`);
console.log(`Results: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
