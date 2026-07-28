(() => {
  const labels = {
    pl: {
      open: "Otwórz referencję",
      empty: "Referencje pojawią się tutaj po dodaniu plików do folderu."
    },
    en: {
      open: "Open reference",
      empty: "References will appear here after files are added to the folder."
    },
    ru: {
      open: "Открыть рекомендацию",
      empty: "Рекомендации появятся здесь после добавления файлов в папку."
    }
  };

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);

  const language = () => {
    const current = (document.documentElement.lang || "pl").slice(0, 2);
    return labels[current] ? current : "pl";
  };

  const localizedReference = (reference) => window.getLocalizedReference
    ? window.getLocalizedReference(reference)
    : reference;

  const renderReferences = () => {
    const container = document.querySelector("[data-reference-grid]");
    if (!container) {
      return;
    }

    const references = window.references || [];
    const dictionary = labels[language()];

    if (!references.length) {
      container.innerHTML = `<p class="reference-empty">${dictionary.empty}</p>`;
      return;
    }

    container.innerHTML = references.map((reference, index) => {
      const item = localizedReference(reference);
      const number = String(index + 1).padStart(2, "0");
      const href = item.file || item.pdf || item.img;

      return `
        <article class="reference-card">
          <a class="reference-preview" href="${escapeHtml(href)}" target="_blank" rel="noopener">
            <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">
          </a>
          <div class="reference-info">
            <span>${number}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.desc)}</p>
            <a class="btn" href="${escapeHtml(href)}" target="_blank" rel="noopener">
              ${dictionary.open} <vk-icon name="external-link"></vk-icon>
            </a>
          </div>
        </article>
      `;
    }).join("");
  };

  document.addEventListener("DOMContentLoaded", renderReferences);
  document.addEventListener("languagechange", renderReferences);
})();
