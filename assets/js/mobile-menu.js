document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#main-menu");

  if (!nav || !toggle || !menu) {
    return;
  }

  const links = [...menu.querySelectorAll("a")];
  const mobileMenu = window.matchMedia("(max-width: 768px)");

  const syncLinkFocus = () => {
    const hideLinks = mobileMenu.matches && !nav.classList.contains("menu-open");
    links.forEach((link) => {
      if (hideLinks) {
        link.tabIndex = -1;
      } else {
        link.removeAttribute("tabindex");
      }
    });
  };

  const setMenuState = (isOpen) => {
    nav.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    syncLinkFocus();
  };

  toggle.addEventListener("click", () => {
    setMenuState(!nav.classList.contains("menu-open"));
  });

  links.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (!mobileMenu.matches) {
      setMenuState(false);
    } else {
      syncLinkFocus();
    }
  });

  syncLinkFocus();
});
