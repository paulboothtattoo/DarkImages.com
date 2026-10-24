/*
 * Cookie consent for DarkImages.com.
 *
 * Governs the one thing on the site that sets cookies: Microsoft Clarity
 * (session recordings and heatmaps).
 *
 * - Visitors whose device time zone is in Europe (EEA, UK, Switzerland and
 *   neighbours) are asked first. Clarity does not load until they accept.
 * - Everyone else gets Clarity by default and can switch it off from the
 *   "Cookie choices" link. A Global Privacy Control signal counts as a
 *   refusal everywhere.
 * - A refusal means Clarity is never loaded.
 *
 * The choice itself is kept in localStorage under "pb-consent". Any element
 * with [data-consent-open] reopens the banner.
 */
(function () {
  "use strict";

  var CLARITY_ID = "z2rumd4v51";
  var STORAGE_KEY = "pb-consent";
  var OPT_IN_ZONES = /^(Europe\/|Atlantic\/(Azores|Madeira|Canary|Reykjavik|Faroe)|Arctic\/Longyearbyen|Asia\/(Nicosia|Famagusta))/;

  function readChoice() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return value === "granted" || value === "denied" ? value : null;
    } catch (_) {
      return null;
    }
  }

  function saveChoice(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (_) {}
  }

  function inOptInRegion() {
    try {
      return OPT_IN_ZONES.test(Intl.DateTimeFormat().resolvedOptions().timeZone || "");
    } catch (_) {
      // Without a time zone, assume consent is required.
      return true;
    }
  }

  // The effective decision: "granted", "denied", or null when we must ask.
  function currentDecision() {
    var stored = readChoice();
    if (stored) return stored;
    if (navigator.globalPrivacyControl === true) return "denied";
    return inOptInRegion() ? null : "granted";
  }

  /* ---------- Microsoft Clarity ---------- */

  var clarityLoaded = false;

  function loadClarity() {
    if (clarityLoaded) return;
    clarityLoaded = true;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
    // Analytics only: Clarity's advertising storage stays off.
    window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
  }

  /* ---------- Banner ---------- */

  var banner = null;

  function closeBanner() {
    if (banner) {
      banner.remove();
      banner = null;
    }
  }

  function choose(value) {
    var previous = currentDecision();
    saveChoice(value);
    closeBanner();
    if (value === "granted") {
      loadClarity();
    } else if (previous === "granted" || clarityLoaded) {
      // Withdrawing consent: tell Clarity to drop its cookies, then reload so
      // Clarity no longer runs on the page.
      if (window.clarity) {
        window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
      }
      window.setTimeout(function () { window.location.reload(); }, 300);
    }
  }

  function openBanner() {
    if (banner) {
      banner.querySelector("button").focus();
      return;
    }
    banner = document.createElement("section");
    banner.className = "consent-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Cookie choices");
    banner.innerHTML =
      '<p class="consent-text">' +
      "With your permission, this site uses Microsoft Clarity cookies to record how pages are " +
      "scrolled and clicked, so the site can be improved. " +
      '<a href="/privacy/#cookies">Privacy Policy</a>' +
      "</p>" +
      '<div class="consent-actions">' +
      '<button type="button" class="consent-button" data-choice="denied">Decline</button>' +
      '<button type="button" class="consent-button" data-choice="granted">Accept</button>' +
      "</div>";
    var buttons = banner.querySelectorAll("[data-choice]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function (event) {
        choose(event.currentTarget.getAttribute("data-choice"));
      });
    }
    document.body.appendChild(banner);
  }

  /* ---------- Start ---------- */

  function init() {
    var decision = currentDecision();
    if (decision === "granted") loadClarity();
    if (decision === null) openBanner();

    document.addEventListener("click", function (event) {
      var trigger = event.target.closest && event.target.closest("[data-consent-open]");
      if (!trigger) return;
      event.preventDefault();
      openBanner();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
