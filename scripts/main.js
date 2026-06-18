/* WAS — Landing Page · interações leves (sem dependências) */
(function () {
  "use strict";

  const root = document.documentElement;

  /* ---------- Tema (claro / escuro) ----------
     Padrão = preferência do sistema. A pessoa pode trocar manualmente;
     a escolha manual é persistida e passa a ter prioridade. Enquanto não
     houver escolha manual, o site acompanha o sistema ao vivo. */
  const THEME_KEY = "was-theme";
  const mql = window.matchMedia("(prefers-color-scheme: dark)");

  function systemTheme() {
    return mql.matches ? "dark" : "light";
  }
  function storedTheme() {
    var v = null;
    try { v = localStorage.getItem(THEME_KEY); } catch (e) {}
    return v === "dark" || v === "light" ? v : null;
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro");
      themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }

  const themeBtn = document.querySelector("[data-theme-toggle]");

  // Estado inicial: escolha manual, ou o padrão do sistema.
  applyTheme(storedTheme() || systemTheme());

  // Troca manual → persiste e ganha prioridade sobre o sistema.
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  // Sistema mudou: só acompanha se a pessoa ainda não escolheu manualmente.
  const onSystemChange = function () {
    if (!storedTheme()) applyTheme(systemTheme());
  };
  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", onSystemChange);
  } else if (typeof mql.addListener === "function") {
    mql.addListener(onSystemChange); // Safari antigo
  }

  /* ---------- Navegação mobile ---------- */
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Ano no rodapé ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
