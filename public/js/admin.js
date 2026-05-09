import { esc, safeId, api, showToast } from "./util.js";

async function loadAll() {
  await Promise.all([loadFrameworks(), loadReviewQueue()]);
}

// ── Frameworks ────────────────────────────────────────────────────────────────
async function loadFrameworks() {
  const fws = await api("/api/frameworks");
  const list = document.getElementById("fw-list");
  list.innerHTML = fws.map(fw =>
    `<span class="badge" style="background:${esc(fw.color)};color:#fff;font-size:.85rem;padding:4px 12px;">${esc(fw.shortName)}</span>`
  ).join("");
}

document.getElementById("add-fw-form").addEventListener("submit", async e => {
  e.preventDefault();
  const body = {
    id:        document.getElementById("fw-id").value.trim().toUpperCase(),
    name:      document.getElementById("fw-name").value.trim(),
    shortName: document.getElementById("fw-short").value.trim(),
    color:     document.getElementById("fw-color").value,
  };
  try {
    await api("/api/admin/frameworks", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    showToast(`Framework "${body.id}" added ✓`);
    e.target.reset();
    await loadFrameworks();
  } catch (err) { showToast(err.message, true); }
});

// ── Crosswalk Import ──────────────────────────────────────────────────────────
document.getElementById("import-form").addEventListener("submit", async e => {
  e.preventDefault();
  const file = document.getElementById("csv-file").files[0];
  if (!file) { showToast("Please select a CSV file", true); return; }

  const fd = new FormData();
  fd.append("file", file);

  const resultDiv = document.getElementById("import-result");
  resultDiv.textContent = "Importing…";

  try {
    const result = await api("/api/import/crosswalk", { method: "POST", body: fd });
    const flagHtml = result.flaggedForReview
      ? `<br><strong style="color:var(--low);">⚑ ${result.flaggedForReview} rows flagged for review (low confidence / "REVIEW NEEDED")</strong>`
      : "";
    const errHtml = result.errors?.length
      ? `<br><span style="color:var(--low);">⚠ ${result.errors.length} rows skipped (${esc(result.errors[0].reason)}${result.errors.length > 1 ? ", …" : ""})</span>`
      : "";
    resultDiv.innerHTML = `<span style="color:var(--high);">✓ ${esc(result.message)}</span>${flagHtml}${errHtml}`;
    showToast(result.message);
    await loadReviewQueue();
  } catch (err) {
    resultDiv.innerHTML = `<span style="color:var(--low);">Import failed: ${esc(err.message)}</span>`;
    showToast(err.message, true);
  }
});

// ── Review Queue ──────────────────────────────────────────────────────────────
async function loadReviewQueue() {
  const items = await api("/api/admin/review-queue");
  document.getElementById("queue-count").textContent = items.length || "";

  const container = document.getElementById("review-queue");
  if (!items.length) {
    container.innerHTML = '<div class="empty-state" style="padding:.75rem;">No items pending review.</div>';
    return;
  }
  container.innerHTML = `
    <table class="mapping-table">
      <thead>
        <tr><th>DS Indicator</th><th>Framework</th><th>Code</th><th>Confidence</th><th>Rationale</th><th></th></tr>
      </thead>
      <tbody>
        ${items.map(m => `
          <tr>
            <td><strong>${esc(m.dsIndicatorId)}</strong></td>
            <td><span class="badge badge-${safeId(m.frameworkId)}">${esc(m.frameworkId)}</span></td>
            <td><code style="font-size:.8rem;">${esc(m.frameworkCode || "—")}</code></td>
            <td><span class="confidence-${safeId(m.confidence)}">${esc(m.confidence)}</span></td>
            <td style="font-size:.8rem;color:var(--muted);max-width:260px;">${esc(m.rationale || "—")}</td>
            <td>
              <button class="btn btn-sm resolve-btn" data-ds="${esc(m.dsIndicatorId)}" data-fw="${esc(m.frameworkId)}"
                style="background:var(--high-bg);color:var(--high);">Resolve</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>`;

  container.querySelectorAll(".resolve-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      try {
        await api(
          `/api/admin/review-queue/${encodeURIComponent(btn.dataset.ds)}/${encodeURIComponent(btn.dataset.fw)}/resolve`,
          { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
        showToast("Resolved ✓");
        await loadReviewQueue();
      } catch (err) { showToast(err.message, true); }
    });
  });
}

// ── Add Recommendation ────────────────────────────────────────────────────────
document.getElementById("add-rec-form").addEventListener("submit", async e => {
  e.preventDefault();
  const body = {
    dsIndicatorId: document.getElementById("rec-ds-id").value.trim(),
    title:         document.getElementById("rec-title").value.trim(),
    description:   document.getElementById("rec-desc").value.trim(),
    resourceUrl:   document.getElementById("rec-url").value.trim(),
    tags:          document.getElementById("rec-tags").value,
  };
  try {
    await api("/api/admin/recommendations", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    showToast(`Recommendation added for ${body.dsIndicatorId} ✓`);
    e.target.reset();
  } catch (err) { showToast(err.message, true); }
});

loadAll().catch(e => showToast(e.message, true));
