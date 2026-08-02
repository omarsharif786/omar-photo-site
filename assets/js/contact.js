(() => {
  "use strict";
  const config = window.SITE_CONFIG || {};
  document.querySelectorAll("[data-site-name]").forEach(el => el.textContent = config.photographerName || "Omar Sharif");
  document.querySelector("#year").textContent = new Date().getFullYear();
  const emailLink = document.querySelector("#direct-email");
  emailLink.textContent = config.email || "your-email@example.com";
  emailLink.href = `mailto:${config.email || "your-email@example.com"}`;
  const socialWrap = document.querySelector("#social-links");
  socialWrap.innerHTML = (config.socials || []).map(item => `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}<span aria-hidden="true">↗</span></a>`).join("");

  document.querySelector("#booking-form").addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Photography inquiry — ${data.get("service")}`);
    const body = encodeURIComponent([
      `Name: ${data.get("name")}`, `Email: ${data.get("email")}`, `Phone: ${data.get("phone") || "Not provided"}`,
      `Service: ${data.get("service")}`, `Preferred date: ${data.get("date") || "Flexible"}`, `Location: ${data.get("location") || "Not provided"}`,
      "", "Project details:", data.get("message")
    ].join("\n"));
    window.location.href = `mailto:${config.email || "your-email@example.com"}?subject=${subject}&body=${body}`;
  });
})();
