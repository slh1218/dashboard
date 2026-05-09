import { esc, safeId, api, showToast } from "./util.js";

let selectedFw = null;
let allFrameworks = [];
let allIndicatorsMeta = [];

async function load() {
  [allFrameworks, allIndicatorsMeta] = await Promise.all([
    api("/api/frameworks"),
    api("/api/indicators"),
  ]);
  renderTiles();
}

function renderTiles() {
  const container = document.getElementById("framework-tiles");
  container.innerHTML = allFrameworks.map(fw => `
    <div class="framework-tile" data-id="${esc(fw.id)}"
         style="background:${esc(fw.color)};"
         title="${esc(fw.name)}">
      <div class="fw-short">${esc(fw.shortName)}</div>
      <div class="fw-count" id="count-${safeId(fw.id)}">…</div>
    </div>
  `).join("");

  // Pre-fill indicator counts in parallel; safe against race conditions because
  // each handler only updates the cell with its own framework id.
  allFrameworks.forEach(async fw => {
    try {
      const detail = await api(`/api/frameworks/${encodeURIComponent(fw.id)}`);
      const el = document.getElementById(`count-${safeId(fw.id)}`);
      if (el) el.textContent = `${detail.indicators?.length || 0} indicators mapped`;
    } catch { /* ignore individual count failures */ }
  });

  container.querySelectorAll(".framework-tile").forEach(tile => {
    tile.addEventListener("click", () => selectFramework(tile.dataset.id));
  });
}

function selectFramework(fwId) {
  selectedFw = fwId;
  document.querySelectorAll(".framework-tile").forEach(t =>
    t.classList.toggle("selected", t.dataset.id === fwId));
  document.getElementById("fw-filter-bar").style.display = "flex";
  renderResults();
}

async function renderResults() {
  if (!selectedFw) return;
  const fw = allFrameworks.find(f => f.id === selectedFw);
  if (!fw) return;

  const gradeFilter = document.getElementById("fw-grade-filter").value;
  const confFilter  = document.getElementById("fw-confidence-filter").value;

  const fwDetail = await api(`/api/frameworks/${encodeURIComponent(fw.id)}`);
  let indicators = fwDetail.indicators || [];

  if (gradeFilter) {
    const indMeta = new Map(allIndicatorsMeta.map(i => [i.id, i]));
    indicators = indicators.filter(i => indMeta.get(i.id)?.gradeBands?.includes(gradeFilter));
  }
  if (confFilter === "low") {
    indicators = indicators.filter(i => i.mapping?.confidence === "low" || i.mapping?.needsReview);
  } else if (confFilter) {
    indicators = indicators.filter(i => i.mapping?.confidence === confFilter);
  }

  const container = document.getElementById("fw-results");

  if (!indicators.length) {
    container.innerHTML = '<div class="empty-state">No indicators match the current filters.</div>';
    return;
  }

  container.innerHTML = `
    <div class="section-title">${esc(fw.name)} — ${indicators.length} aligned DS Indicators</div>
    <div class="card">
      <table class="mapping-table">
        <thead>
          <tr><th>DS Indicator</th><th>Title</th><th>Framework Code</th><th>Confidence</th><th>Rationale</th></tr>
        </thead>
        <tbody>
          ${indicators.map(ind => `
            <tr>
              <td><a href="/indicator.html?id=${encodeURIComponent(ind.id)}" style="color:var(--accent);font-weight:700;text-decoration:none;">${esc(ind.id)}</a></td>
              <td>${esc(ind.title || "—")}</td>
              <td><code style="font-size:.8rem;">${esc(ind.mapping?.frameworkCode || "—")}</code></td>
              <td><span class="confidence-${safeId(ind.mapping?.confidence || "medium")}">${esc(ind.mapping?.confidence || "—")}</span>
                  ${ind.mapping?.needsReview ? '<span class="review-flag"> ⚑ Review</span>' : ""}</td>
              <td style="font-size:.8rem;color:var(--muted);max-width:280px;">${esc(ind.mapping?.rationale || "—")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

["fw-grade-filter", "fw-confidence-filter"].forEach(id =>
  document.getElementById(id).addEventListener("change", renderResults));

load().catch(e => showToast(e.message, true));
