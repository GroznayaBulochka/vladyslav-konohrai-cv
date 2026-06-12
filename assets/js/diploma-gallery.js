(() => {
  const diplomas = window.diplomas || [];
  let currentDiploma = 0;

  const getElements = () => ({
    image: document.getElementById("diplomaImage"),
    title: document.getElementById("diplomaTitle"),
    description: document.getElementById("diplomaDesc"),
    pdf: document.getElementById("diplomaPdf"),
    count: document.getElementById("diplomaCount"),
    thumbs: document.querySelectorAll(".diploma-thumbs img"),
    prevButton: document.querySelector("[data-diploma-prev]"),
    nextButton: document.querySelector("[data-diploma-next]")
  });

  const formatCount = (index) => {
    const current = String(index + 1).padStart(2, "0");
    const total = String(diplomas.length).padStart(2, "0");
    return `${current} / ${total}`;
  };

  const showDiploma = (index) => {
    if (!diplomas.length) {
      return;
    }

    const elements = getElements();
    const requestedIndex = Number(index);
    const safeIndex = Number.isFinite(requestedIndex) ? requestedIndex : 0;
    currentDiploma = ((safeIndex % diplomas.length) + diplomas.length) % diplomas.length;
    const diploma = window.getLocalizedDiploma
      ? window.getLocalizedDiploma(diplomas[currentDiploma])
      : diplomas[currentDiploma];

    if (elements.image) {
      elements.image.src = diploma.img;
      elements.image.alt = diploma.title;
    }

    if (elements.title) {
      elements.title.textContent = diploma.title;
    }

    if (elements.description) {
      elements.description.textContent = diploma.desc;
    }

    if (elements.pdf) {
      elements.pdf.href = diploma.pdf;
    }

    if (elements.count) {
      elements.count.textContent = formatCount(currentDiploma);
    }

    elements.thumbs.forEach((thumb, thumbIndex) => {
      const isActive = thumbIndex === currentDiploma;
      thumb.classList.toggle("active", isActive);
      thumb.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const nextDiploma = () => showDiploma(currentDiploma + 1);
  const prevDiploma = () => showDiploma(currentDiploma - 1);
  const refreshDiploma = () => showDiploma(currentDiploma);

  const bindThumbs = (thumbs) => {
    thumbs.forEach((thumb, index) => {
      thumb.setAttribute("role", "button");
      thumb.tabIndex = 0;

      thumb.addEventListener("click", () => showDiploma(index));
      thumb.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showDiploma(index);
        }
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    const elements = getElements();

    elements.prevButton?.addEventListener("click", prevDiploma);
    elements.nextButton?.addEventListener("click", nextDiploma);
    bindThumbs(elements.thumbs);
    showDiploma(currentDiploma);
  });

  window.showDiploma = showDiploma;
  window.nextDiploma = nextDiploma;
  window.prevDiploma = prevDiploma;
  window.refreshDiploma = refreshDiploma;
})();
