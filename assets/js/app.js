(() => {
  "use strict";
  const config = window.SITE_CONFIG || {};
  const images = Array.isArray(window.GALLERY_IMAGES) ? window.GALLERY_IMAGES : [];
  const gallery = document.querySelector("#gallery");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightbox-image");
  const caption = document.querySelector("#lightbox-caption");
  const toast = document.querySelector(".copy-toast");
  let visibleImages = [...images];
  let currentIndex = 0;

  document.querySelectorAll("[data-site-name]").forEach(el => el.textContent = config.photographerName || "Omar Sharif");
  document.querySelectorAll("[data-watermark]").forEach(el => el.textContent = config.watermark || `© ${config.photographerName || "Omar Sharif"} Photography`);
  const bio = document.querySelector("[data-bio]");
  if (bio && config.bio) bio.textContent = config.bio;
  document.querySelector("#year").textContent = new Date().getFullYear();

  function socialLinks() {
    const wrap = document.querySelector("#social-links");
    if (!wrap) return;
    wrap.innerHTML = (config.socials || []).map(item => `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}<span aria-hidden="true">↗</span></a>`).join("");
  }

  function card(item, index) {
    return `<button class="gallery-card protected" data-index="${index}" data-category="${item.category}" aria-label="Open ${item.title}">
      <img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async" draggable="false">
      <span class="card-overlay"><strong>${item.title}</strong><small>${item.category}</small></span>
      <span class="watermark card-watermark">${config.watermark || "© Omar Sharif Photography"}</span>
    </button>`;
  }

  function render(filter = "all") {
    visibleImages = filter === "all" ? [...images] : images.filter(item => item.category === filter);
    gallery.innerHTML = visibleImages.map(card).join("");
    gallery.querySelectorAll(".gallery-card").forEach(btn => btn.addEventListener("click", () => openLightbox(Number(btn.dataset.index))));
    protectImages();
  }

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    if (typeof lightbox.showModal === "function") lightbox.showModal(); else lightbox.setAttribute("open", "");
    document.body.classList.add("modal-open");
  }

  function updateLightbox() {
    const item = visibleImages[currentIndex];
    if (!item) return;
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    caption.textContent = `${item.title} — ${item.category}`;
  }

  function move(direction) {
    currentIndex = (currentIndex + direction + visibleImages.length) % visibleImages.length;
    updateLightbox();
  }

  function closeLightbox() {
    if (typeof lightbox.close === "function") lightbox.close(); else lightbox.removeAttribute("open");
    document.body.classList.remove("modal-open");
  }

  function showProtectionMessage() {
    toast.classList.add("show");
    clearTimeout(showProtectionMessage.timer);
    showProtectionMessage.timer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function protectImages() {
    document.querySelectorAll(".protected img, .protected-image-wrap img, .hero img").forEach(img => {
      img.setAttribute("draggable", "false");
      img.addEventListener("dragstart", event => event.preventDefault());
      img.addEventListener("contextmenu", event => { event.preventDefault(); showProtectionMessage(); });
    });
  }

  document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(btn => { btn.classList.remove("is-active"); btn.setAttribute("aria-pressed", "false"); });
    button.classList.add("is-active"); button.setAttribute("aria-pressed", "true"); render(button.dataset.filter);
  }));

  document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  document.querySelector(".lightbox-prev").addEventListener("click", () => move(-1));
  document.querySelector(".lightbox-next").addEventListener("click", () => move(1));
  lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", event => {
    if (!lightbox.hasAttribute("open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });

  document.addEventListener("contextmenu", event => {
    if (event.target.closest(".protected, .protected-image-wrap, .hero")) { event.preventDefault(); showProtectionMessage(); }
  });
  document.addEventListener("selectstart", event => { if (event.target.closest(".protected, .protected-image-wrap")) event.preventDefault(); });

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  navToggle?.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });

  socialLinks(); render(); protectImages();
})();
