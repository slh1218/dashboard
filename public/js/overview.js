import { esc, safeId, api, showToast } from "./util.js";

const SCHOOL_ID = "school-demo";

let allIndicators = [], allFrameworks = [], allPerf = [], allMappings = [];

async function load() {
  [allIndicators, allFrameworks, allPerf] = await Promise.all([
    api("/api/indicators"),
    api("/api/frameworks"),
    api(`/api/performance?schoolId=${encodeURIComponent(SCHOOL_ID)}`),
  ]);

  // Reset any prior accumulation, then collect mappings via each framework's detail endpoint
  allMappings = [];
  const mapData = await Promise.all(allFrameworks.map(fw => api(`/api/frameworks/${encodeURIComponent(fw.id)}`)));
  mapData.forEach(fwDetail => {
    (fwDetail.indicators || []).forEach(ind => {
      allMappings.push({ dsIndicatorId: ind.id, frameworkId: fwDetail.id, ...ind.mapping });
    });
  });

  populateFrameworkFilter();
  await renderSummary();
  renderGrid();
}

function populateFrameworkFilter() {
  const sel = document.getElementById("fw-filter");
  // Clear all but the first option (the "All" sentinel)
  while (sel.options.length > 1) sel.remove(1);
  allFrameworks.forEach(fw => {
    const o = document.createElement("option");
    o.value = fw.id; o.textContent = fw.shortName;
    sel.appendChild(o);
  });
}

async function renderSummary() {
  const { strengths, growth } = await api(`/api/performance/summary/${encodeURIComponent(SCHOOL_ID)}`);
  const indById = new Map(allIndicators.map(i => [i.id, i]));

  document.getElementById("strengths-list").innerHTML =
    strengths.length
      ? strengths.map(p => `<li>${esc(indById.get(p.dsIndicatorId)?.title || p.dsIndicatorId)}
          <span style="font-size:.75rem;color:var(--high);">(${esc(p.gradeBand)})</span></li>`).join("")
      : "<li style='color:var(--muted)'>No high-performance indicators recorded yet.</li>";

  document.getElementById("growth-list").innerHTML =
    growth.length
      ? growth.map(p => `<li><a href="/indicator.html?id=${encodeURIComponent(p.dsIndicatorId)}" style="color:var(--low);">${esc(indById.get(p.dsIndicatorId)?.title || p.dsIndicatorId)}</a>
          <span style="font-size:.75rem;color:var(--muted);">(${esc(p.gradeBand)})</span></li>`).join("")
      : "<li style='color:var(--muted)'>No low-performance indicators recorded yet.</li>";
}

function renderCard(ind, perfMap, fwMap, fwById) {
  const perf = perfMap.get(ind.id);
  const maps = fwMap.get(ind.id) || [];

  const fwBadges = maps.map(m => {
    const fw = fwById.get(m.frameworkId);
    if (!fw) return "";
    return `<span class="badge badge-${safeId(fw.id)}">${esc(fw.shortName)}</span>`;
  }).join("");

  const perfBlock = perf
    ? `<div style="display:flex;align-items:center;gap:.5rem;margin-top:.5rem;">
         <span class="level-pill level-${safeId(perf.level)}">${esc(perf.level)}</span>
         <span style="font-size:.75rem;color:var(--muted);">Score ${esc(perf.score)}/4 · ${esc(perf.gradeBand)}</span>
       </div>`
    : `<div style="margin-top:.5rem;"><button class="btn btn-sm" style="background:var(--bg);" data-record="${esc(ind.id)}">+ Record Score</button></div>`;

  return `
    <a href="/indicator.html?id=${encodeURIComponent(ind.id)}" class="card indicator-card">
      <div class="card-id">${esc(ind.id)}</div>
      <h3>${esc(ind.title)}</h3>
      <p>${esc(ind.description)}</p>
      <div class="badge-row">${fwBadges}</div>
      ${perfBlock}
    </a>`;
}

function renderGrid() {
  const fwFilter    = document.getElementById("fw-filter").value;
  const gradeFilter = document.getElementById("grade-filter").value;
  const levelFilter = document.getElementById("level-filter").value;

  const perfMap = new Map(allPerf.map(p => [p.dsIndicatorId, p]));
  const fwById  = new Map(allFrameworks.map(fw => [fw.id, fw]));

  const fwMap = new Map();
  allMappings.forEach(m => {
    if (!fwMap.has(m.dsIndicatorId)) fwMap.set(m.dsIndicatorId, []);
    fwMap.get(m.dsIndicatorId).push(m);
  });

  let indicators = allIndicators;

  if (fwFilter) {
    const mapped = new Set(allMappings.filter(m => m.frameworkId === fwFilter).map(m => m.dsIndicatorId));
    indicators = indicators.filter(i => mapped.has(i.id));
  }
  if (gradeFilter) indicators = indicators.filter(i => i.gradeBands?.includes(gradeFilter));
  if (levelFilter) {
    const perfByLevel = new Set(allPerf.filter(p => p.level === levelFilter).map(p => p.dsIndicatorId));
    indicators = indicators.filter(i => perfByLevel.has(i.id));
  }

  const grid  = document.getElementById("card-grid");
  const count = document.getElementById("card-count");
  count.textContent = `Indicators (${indicators.length})`;

  if (!indicators.length) {
    grid.innerHTML = '<div class="empty-state">No indicators match the current filters.</div>';
    return;
  }
  grid.innerHTML = indicators.map(i => renderCard(i, perfMap, fwMap, fwById)).join("");

  grid.querySelectorAll("[data-record]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      openModal(btn.dataset.record);
    });
  });
}

function openModal(dsId) {
  document.getElementById("modal-ds-id").value = dsId;
  document.getElementById("modal-score").value = "";
  document.getElementById("modal-overlay").style.display = "flex";
}
function closeModal() { document.getElementById("modal-overlay").style.display = "none"; }

document.getElementById("modal-cancel").addEventListener("click", closeModal);
document.getElementById("modal-overlay").addEventListener("click", e => {
  if (e.target.id === "modal-overlay") closeModal();
});

document.getElementById("modal-save").addEventListener("click", async () => {
  const dsId         = document.getElementById("modal-ds-id").value;
  const score        = Number(document.getElementById("modal-score").value);
  const gradeBand    = document.getElementById("modal-grade").value;
  const evidenceType = document.getElementById("modal-evidence").value;

  if (!Number.isFinite(score) || score < 1 || score > 4) {
    showToast("Score must be a number between 1 and 4", true); return;
  }

  try {
    await api("/api/performance", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schoolId: SCHOOL_ID, dsIndicatorId: dsId, score, gradeBand, evidenceType, schoolYear: "2024-25" }),
    });
    closeModal();
    showToast("Performance recorded ✓");
    allPerf = await api(`/api/performance?schoolId=${encodeURIComponent(SCHOOL_ID)}`);
    await renderSummary();
    renderGrid();
  } catch (e) { showToast(e.message, true); }
});

["fw-filter", "grade-filter", "level-filter"].forEach(id =>
  document.getElementById(id).addEventListener("change", renderGrid));

document.getElementById("clear-filters").addEventListener("click", () => {
  ["fw-filter", "grade-filter", "level-filter"].forEach(id => document.getElementById(id).value = "");
  renderGrid();
});

load().catch(err => {
  document.getElementById("card-grid").innerHTML = `<div class="empty-state">Failed to load: ${esc(err.message)}</div>`;
});
