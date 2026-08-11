/**
 * modal.js
 * ------------------------------------------------------------------
 * Fenêtre modale générique utilisée pour tous les formulaires "Ajouter"
 * (élève, professeur, classe, note, paiement...). Un seul composant,
 * réutilisé partout via openModal({ title, fields, onSubmit }).
 * ------------------------------------------------------------------
 */

function openModal({ title, fields, submitLabel = "Enregistrer", onSubmit }) {
  closeModal();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "genericModal";

  const fieldsHtml = fields
    .map((f) => {
      if (f.type === "select") {
        const opts = (f.options || [])
          .map((o) => `<option value="${o.value}">${o.label}</option>`)
          .join("");
        return `
          <div class="form-field">
            <label>${f.label}</label>
            <select name="${f.name}" ${f.required ? "required" : ""}>
              <option value="">Sélectionner...</option>
              ${opts}
            </select>
          </div>`;
      }
      return `
        <div class="form-field">
          <label>${f.label}</label>
          <input type="${f.type || "text"}" name="${f.name}" placeholder="${f.placeholder || ""}" ${f.required ? "required" : ""} />
        </div>`;
    })
    .join("");

  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h3>${title}</h3>
        <button type="button" class="modal-close" id="modalCloseBtn" aria-label="Fermer">✕</button>
      </div>
      <form id="modalForm" class="form-grid">${fieldsHtml}</form>
      <div class="modal-footer">
        <span class="modal-error" id="modalError"></span>
        <div>
          <button type="button" class="btn btn-outline" id="modalCancelBtn">Annuler</button>
          <button type="submit" form="modalForm" class="btn btn-primary" id="modalSubmitBtn">${submitLabel}</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add("modal-open");

  const close = () => closeModal();
  document.getElementById("modalCloseBtn").addEventListener("click", close);
  document.getElementById("modalCancelBtn").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  const form = document.getElementById("modalForm");
  const errorEl = document.getElementById("modalError");
  const submitBtn = document.getElementById("modalSubmitBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Enregistrement...";

    const values = Object.fromEntries(new FormData(form).entries());
    try {
      await onSubmit(values);
      closeModal();
    } catch (err) {
      errorEl.textContent = err.message || "Impossible d'enregistrer. Vérifiez la connexion à l'API.";
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    }
  });
}

function closeModal() {
  const existing = document.getElementById("genericModal");
  if (existing) existing.remove();
  document.body.classList.remove("modal-open");
}
