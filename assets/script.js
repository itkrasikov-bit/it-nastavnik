(function () {
  "use strict";

  var TELEGRAM = "https://t.me/Itkrasikov";
  var PHONE = "+7 918 931-25-00";

  /* ---------- header on scroll ---------- */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  function closeMenu() {
    if (!nav || !burger) return;
    nav.classList.remove("is-open");
    burger.classList.remove("is-active");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-active", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (e.target.closest("#nav") || e.target.closest("#burger")) return;
      closeMenu();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealItems.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- price cards -> form ---------- */
  var form = document.getElementById("leadForm");
  var chosen = document.getElementById("chosen");
  var chosenName = document.getElementById("chosenName");
  var chosenClear = document.getElementById("chosenClear");
  var goalSelect = document.getElementById("goal");
  var currentPackage = "";

  document.querySelectorAll("[data-package]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentPackage = btn.getAttribute("data-package") || "";

      if (chosen && chosenName) {
        chosenName.textContent = currentPackage;
        chosen.hidden = false;
      }

      if (goalSelect) {
        var value = currentPackage.toLowerCase();
        if (value.indexOf("нейросет") > -1) goalSelect.value = "Нейросети для работы";
        else if (value.indexOf("подрост") > -1) goalSelect.value = "Подростку 12–17";
      }

      if (form) {
        form.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(function () {
          var nameInput = document.getElementById("name");
          if (nameInput && !nameInput.value.trim()) nameInput.focus({ preventScroll: true });
        }, 450);
      }
    });
  });

  if (chosenClear) {
    chosenClear.addEventListener("click", function () {
      currentPackage = "";
      if (chosen) chosen.hidden = true;
    });
  }

  /* ---------- form -> telegram ---------- */
  if (form) {
    var nameInput = document.getElementById("name");
    var contactInput = document.getElementById("contact");
    var timeSelect = document.getElementById("time");
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalLabel = submitBtn ? submitBtn.textContent : "";

    function setError(input, hasError) {
      if (!input) return;
      var field = input.closest(".field");
      if (field) field.classList.toggle("has-error", hasError);
    }

    [nameInput, contactInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener("input", function () { setError(input, false); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = nameInput ? nameInput.value.trim() : "";
      var contact = contactInput ? contactInput.value.trim() : "";
      var ok = true;

      if (!name) { setError(nameInput, true); ok = false; }
      if (!contact) { setError(contactInput, true); ok = false; }

      if (!ok) {
        if (nameInput && !name) nameInput.focus();
        else if (contactInput) contactInput.focus();
        return;
      }

      var lines = [
        "Здравствуйте, Константин! Хочу записаться на бесплатный разбор.",
        "",
        "Имя: " + name,
        "Связь: " + contact,
        "Интересует: " + (goalSelect ? goalSelect.value : "—"),
        "Удобное время: " + (timeSelect ? timeSelect.value : "—")
      ];

      if (currentPackage) lines.push("Интересовал пакет: " + currentPackage);

      lines.push("", "Нашёл вас на сайте.");

      var url = TELEGRAM + "?text=" + encodeURIComponent(lines.join("\n"));
      var win = null;

      try {
        win = window.open(url, "_blank");
        if (win) win.opener = null;
      } catch (err) {
        win = null;
      }

      if (!win) {
        window.location.href = url;
        return;
      }

      if (submitBtn) {
        submitBtn.textContent = "Telegram открыт — нажмите «Отправить»";
        submitBtn.disabled = true;
        window.setTimeout(function () {
          submitBtn.textContent = originalLabel;
          submitBtn.disabled = false;
        }, 6000);
      }
    });
  }

  /* ---------- year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- tel/telegram tracking hook ---------- */
  window.dataLayer = window.dataLayer || [];
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener("click", function () {
      window.dataLayer.push({ event: "phone_click" });
    });
  });
})();
