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
    nextButton: document.querySelector("[data-diploma-next]"),
    autoplayButton: document.querySelector("[data-diploma-autoplay]")
  });

  let autoplayTimer;
  let isAutoplayEnabled = false;

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
      elements.image.classList.remove("is-loaded");
      elements.image.alt = diploma.title;
      elements.image.onload = () => elements.image.classList.add("is-loaded");
      elements.image.src = diploma.img;

      if (elements.image.complete) {
        requestAnimationFrame(() => elements.image.classList.add("is-loaded"));
      }
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

  const isGalleryVisible = () => {
    const gallery = document.querySelector(".diploma-section");
    const rect = gallery?.getBoundingClientRect();

    return Boolean(rect && rect.top < window.innerHeight && rect.bottom > 0);
  };

  const setAutoplay = (enabled) => {
    const elements = getElements();
    isAutoplayEnabled = enabled;
    clearInterval(autoplayTimer);

    if (isAutoplayEnabled && !document.hidden) {
      autoplayTimer = setInterval(nextDiploma, 4200);
    }

    if (elements.autoplayButton) {
      elements.autoplayButton.setAttribute("aria-pressed", isAutoplayEnabled ? "true" : "false");
      elements.autoplayButton.querySelector("vk-icon")?.setAttribute("name", isAutoplayEnabled ? "pause" : "play");
    }
  };

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
    elements.autoplayButton?.addEventListener("click", () => setAutoplay(!isAutoplayEnabled));
    document.addEventListener("keydown", (event) => {
      const tagName = event.target?.tagName?.toLowerCase();

      if (tagName === "input" || tagName === "textarea" || tagName === "button") {
        return;
      }

      if (!isGalleryVisible()) {
        return;
      }

      if (event.key === "ArrowLeft") {
        prevDiploma();
      }

      if (event.key === "ArrowRight") {
        nextDiploma();
      }
    });
    bindThumbs(elements.thumbs);
    showDiploma(currentDiploma);
  });

  document.addEventListener("languagechange", refreshDiploma);
  document.addEventListener("visibilitychange", () => {
    if (isAutoplayEnabled) {
      setAutoplay(true);
    }
  });
})();
