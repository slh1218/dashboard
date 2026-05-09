import { esc, safeId, safeUrl, api, showToast } from "./util.js";

async function load() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (!id) { location.href = "/"; return; }

  const detail = await api(`/api/indicators/${encodeURIComponent(id)}`);
  document.title = `${detail.id} – ${detail.title} | CMSN`;

  document.getElementById("ds-id").textContent    = detail.id;
  document.getElementById("ds-title").textContent = detail.title;
  document.getElementById("ds-desc").textContent  = detail.description;

  const meta = document.getElementById("ds-meta");
  meta.innerHTML = "";
  detail.gradeBands?.forEach(gb => {
    meta.insertAdjacentHTML("beforeend",
      `<span class="badge" style="background:#edf2f7;color:var(--muted);">${esc(gb)}</span>`);
  });
  detail.evidenceTypes?.forEach(et => {
    meta.insertAdjacentHTML("beforeend",
      `<span class="badge" style="background:rgba(200,150,12,.1);color:var(--accent);">${esc(et)}</span>`);
  });

  renderMappings(detail.mappings || []);
  renderPerformance(detail.performance || []);
  renderRecommendations(detail.recommendations || []);
}

function renderMappings(mappings) {
  const tbody = document.getElementById("mapping-body");
  if (!mappings.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--muted);">No framework alignments recorded.</td></tr>';
    return;
  }
  tbody.innerHTML = mappings.map(m => `
    <tr>
      <td><span class="badge badge-${safeId(m.frameworkId)}">${esc(m.frameworkId)}</span></td>
      <td><code style="font-size:.8rem;">${esc(m.frameworkCode || "—")}</code></td>
      <td><span class="confidence-${safeId(m.confidence)}">${esc(m.confidence)}</span>
          ${m.needsReview ? '<span class="review-flag"> ⚑ Needs Review</span>' : ""}</td>
      <td style="font-size:.8rem;color:var(--muted);max-width:320px;">${esc(m.rationale || "—")}</td>
    </tr>
  `).join("");
}

function renderPerformance(perfs) {
  const area = document.getElementById("performance-area");
  if (!perfs.length) {
    area.innerHTML = '<div class="empty-state" style="padding:1rem;">No performance data recorded yet.</div>';
    return;
  }
  area.innerHTML = `
    <table class="mapping-table">
      <thead><tr><th>School Year</th><th>Grade Band</th><th>Evidence Type</th><th>Score</th><th>Level</th></tr></thead>
      <tbody>
        ${perfs.map(p => `
          <tr>
            <td>${esc(p.schoolYear || "—")}</td>
            <td>${esc(p.gradeBand || "—")}</td>
            <td>${esc(p.evidenceType || "—")}</td>
            <td>${esc(p.score)}/4</td>
            <td><span class="level-pill level-${safeId(p.level)}">${esc(p.level)}</span></td>
          </tr>
        `).join("")}
      </tbody>
    </table>`;
}

function renderRecommendations(recs) {
  const area = document.getElementById("rec-area");
  if (!recs.length) {
    area.innerHTML = '<div class="empty-state">No recommendations linked. Ask your CMSN coordinator or add one via Admin.</div>';
    return;
  }
  area.innerHTML = recs.map(r => {
    const url = safeUrl(r.resourceUrl);
    return `
      <div class="rec-card">
        <div class="rec-icon">📚</div>
        <div>
          <h4>${esc(r.title)}</h4>
          <p>${esc(r.description)}</p>
          ${url ? `<a href="${url}" target="_blank" rel="noopener noreferrer">View Resource →</a>` : ""}
          <div class="tag-row">${(r.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        </div>
      </div>`;
  }).join("");
}

load().catch(e => showToast(e.message, true));
